class Terrain extends _3DObject {
    MAX_HEIGHT = 1000;

    constructor(program, gridX, gridZ, vertexCount, size) {
        super(program, vec3(gridX * size, 0, gridZ * size));
        this.gridX = gridX;
        this.gridZ = gridZ;
        this.vertexCount = vertexCount;
        this.size = size;

        this.material = {
            ambient: vec3(0.2, 0.3, 0.4),
            diffuse: vec3(0.3, 0.6, 0.5),
            specular: vec3(0.9, 1.0, 0.9),
            shininess: 30.0
        }
    }

    getHeight(x, y) {
        let vertexCount = this.vertexCount;

        if (x < 0 || x >= vertexCount || y < 0 || y >= vertexCount) {
            return 0.0;
        }

        return this.MAX_HEIGHT * generateHeight(x + this.gridX * vertexCount, y + this.gridZ * vertexCount, vertexCount, vertexCount);
    }

    calcNormal(x, z) {
        let heightL = this.getHeight(x - 1, z);
        let heightR = this.getHeight(x + 1, z);
        let heightD = this.getHeight(x, z - 1);
        let heightU = this.getHeight(x, z + 1);

        let normal = vec4(heightL - heightR, 2.0, heightD - heightU, 0.0);
        normal = normalize(normal)
        return normal;
    }

    loadData() {
        let self = this;

        let generateVerticesNormalsTexels = function (vertexCount) {
            for (let i = 0; i < vertexCount; i++) {
                for (let j = 0; j < vertexCount; j++) {
                    let x = j / (vertexCount - 1.0) * self.size;
                    let y = self.getHeight(j, i);
                    let z = i / (vertexCount - 1.0) * self.size;

                    let texCoordX = j / (vertexCount - 1);
                    let texCoordY = i / (vertexCount - 1);

                    self.vertices.push(vec4(x, y, z, 1.0));
                    self.normals.push(self.calcNormal(j, i));
                    self.textureCoords.push(vec2(texCoordX, texCoordY));
                }
            }
        };

        let generateIndices = function (vertexCount) {
            for (let z = 0; z < vertexCount - 1; z++)
                for (let x = 0; x < vertexCount - 1; x++) {
                    let topLeft = z * vertexCount + x;
                    let topRight = topLeft + 1;
                    let bottomLeft = ((z + 1) * vertexCount) + x;
                    let bottomRight = bottomLeft + 1;

                    self.indices.push(topLeft);
                    self.indices.push(bottomLeft);
                    self.indices.push(topRight);
                    self.indices.push(topRight);
                    self.indices.push(bottomLeft);
                    self.indices.push(bottomRight);
                }
        };

        generateVerticesNormalsTexels(this.vertexCount);
        generateIndices(this.vertexCount);
    }

    init() {
        super.init();
        var maxHeight = gl.getUniformLocation(this.program, "MAX_HEIGHT");
        gl.uniform1f(maxHeight, this.MAX_HEIGHT);
    }
}