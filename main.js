let camera;
let light;
let program;

let angle = 0.0;
let trackingMouse = false;

let lastX = screen.width / 2, lastY = screen.height / 2
let firstMouse = true

let yaw = -320.0
let pitch = -63.0

let terrainHorMin = -1, terrainHorMax = 1;
let terrainVertMin = -1, terrainVertMax = 1;

function trackballView(x, y) {
    let d, a;
    let v = [];

    v[0] = x;
    v[1] = y;

    d = v[0] * v[0] + v[1] * v[1];

    if (d < 1.0) {
        v[2] = Math.sqrt(1.0 - d);
    }
    else {
        v[2] = 0.0;
        a = 1.0 / Math.sqrt(d);
        v[0] *= a;
        v[1] *= a;
    }

    return v;
}

function startMotion() {
    trackingMouse = true;
}

function stopMotion() {
    trackingMouse = false;
    camera.reset();
}

function loadTextures(urls) {
    let textures = [];

    for (let i = 0; i < urls.length; i++) {
        const texture = gl.createTexture();
        const image = new Image();

        image.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        };

        image.src = urls[i][1];
        textures.push([urls[i][0], texture]);
    }

    return textures;
}

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var textures = loadTextures([
        ['grass_diff', 'http://localhost:8000/textures/grass_diff.jpg'],
        ['snow_diff', 'http://localhost:8000/textures/snow_diff.jpg'],
        ['rock_diff', 'http://localhost:8000/textures/rock_diff.jpg'],
        ['sand_diff', 'http://localhost:8000/textures/sand_diff.jpg'],
        ['beach_diff', 'http://localhost:8000/textures/beach_diff.jpg'],
        ['forest_diff', 'http://localhost:8000/textures/forest_diff.jpg'],
        ['water_diff', 'http://localhost:8000/textures/water_diff.jpg'],
        ['snow_spec', 'http://localhost:8000/textures/snow_spec.jpg'],
        ['rock_spec', 'http://localhost:8000/textures/rock_spec.jpg'],
        ['sand_spec', 'http://localhost:8000/textures/sand_spec.jpg'],
    ]);

    camera = new Camera(program, vec3(-1800, 3650, -1200), vec3(0, 0, 0), vec3(0, 1, 0));

    light1 = new Light(program, vec4(1, 4.5, 1, 1));
    light1.intensity.ambient = vec3(0.2, 0.2, 0.2);
    light1.intensity.diffuse = vec3(0.2, 0.2, 0.2);
    light1.intensity.specular = vec3(1.0, 1.0, 1.0);

    light2 = new Light(program, vec4(0, 0, 0, 1));
    light2.intensity.ambient = vec3(0.3, 0.6, 0.9);
    light2.intensity.diffuse = vec3(0.9, 0.6, 0.3);
    light2.intensity.specular = vec3(0.5, 0.75, 1.0);

    for (var i = 0; i < textures.length; ++i) {
        let textureName = 'Tex_' + textures[i][0];
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, textures[i][1]);
        gl.uniform1i(gl.getUniformLocation(program, textureName), i);
    }

    terrain1 = new Terrain(program, -1, -1, 256, 800.0);
    terrain1.init();

    terrain2 = new Terrain(program, 1, -1, 256, 800.0);
    terrain2.init();

    terrain3 = new Terrain(program, 0, -1, 256, 800.0);
    terrain3.init();

    terrain4 = new Terrain(program, -1, 0, 256, 800.0);
    terrain4.init();

    terrain5 = new Terrain(program, 0, 0, 256, 800.0);
    terrain5.init();

    terrain6 = new Terrain(program, 1, 0, 256, 800.0);
    terrain6.init();

    terrain7 = new Terrain(program, 0, 1, 256, 800.0);
    terrain7.init();

    terrain8 = new Terrain(program, -1, 1, 256, 800.0);
    terrain8.init();

    terrain9 = new Terrain(program, 1, 1, 256, 800.0);
    terrain9.init();

    terrains = [];

    terrains.push(
        terrain1,
        terrain2,
        terrain3,
        terrain4,
        terrain5,
        terrain6,
        terrain7,
        terrain8,
        terrain9
    );

    window.onkeydown = function (event) {
        if (!trackingMouse) {
            let key = String.fromCharCode(event.keyCode)

            switch (key) {
                case 'W':
                    camera.position = add(camera.position, scale(camera.SPEED, camera.front));
                    break;
                case 'A':
                    camera.position = subtract(camera.position, scale(camera.SPEED, normalize(cross(camera.front, camera.up))));
                    break;
                case 'S':
                    camera.position = subtract(camera.position, scale(camera.SPEED, camera.front));
                    break;
                case 'D':
                    camera.position = add(camera.position, scale(camera.SPEED, normalize(cross(camera.front, camera.up))));
                    break;
                case 'E':
                    camera.position = add(camera.position, scale(camera.SPEED, camera.up));
                    break;
                case 'Q':
                    camera.position = subtract(camera.position, scale(camera.SPEED, camera.up));
                    break;
            }
        }
    }

    window.onmousemove = function (event) {
        xPos = event.screenX;
        yPos = event.screenY;

        if (firstMouse) {
            lastX = xPos;
            lastY = yPos;
            firstMouse = false
        }

        xOffset = xPos - lastX;
        yOffset = lastY - yPos;
        lastX = xPos;
        lastY = yPos;

        let sensivity = 1.0
        xOffset *= sensivity
        yOffset *= sensivity

        if (!trackingMouse) {
            yaw += xOffset
            pitch += yOffset

            if (pitch > 89.0)
                pitch = 89.0;
            if (pitch < -89.0)
                pitch = -89.0;

            let front = vec3(
                Math.cos(radians(yaw)) * Math.cos(radians(pitch)),
                Math.sin(radians(pitch)),
                Math.sin(radians(yaw)) * Math.cos(radians(pitch))
            )

            camera.front = normalize(front)
        } else {
            camera.moveTrackball(xOffset, yOffset);
        }
    }

    canvas.addEventListener("mousedown", function (event) {
        startMotion();
    });

    canvas.addEventListener("mouseup", function (event) {
        stopMotion();
    });

    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Procedural generation implementation
    // Do not run under any circumstances

    // if (camera.position[0] > terrainHorMax * 800.0) {
    //     terrainHorMax++;
    //     for (let vertIndex = terrainVertMin; vertIndex <= terrainVertMax; vertIndex++) {
    //         let newTerrainTile = new Terrain(program, terrainHorMax, vertIndex, 256, 800.0);
    //         newTerrainTile.init();
    //         terrains.push(newTerrainTile);
    //     }
    // }

    // if (camera.position[0] < terrainHorMin * 800.0) {
    //     terrainHorMin--;
    //     for (let vertIndex = terrainVertMin; vertIndex <= terrainVertMax; vertIndex++) {
    //         let newTerrainTile = new Terrain(program, terrainHorMin, vertIndex, 256, 800.0);
    //         newTerrainTile.init();
    //         terrains.push(newTerrainTile);
    //     }
    // }

    // if (camera.position[2] > terrainVertMax * 800.0) {
    //     terrainVertMax++;
    //     for (let horIndex = terrainHorMin; horIndex <= terrainHorMax; horIndex++) {
    //         let newTerrainTile = new Terrain(program, horIndex, terrainVertMax, 256, 800.0);
    //         newTerrainTile.init();
    //         terrains.push(newTerrainTile);
    //     }
    // }

    // if (camera.position[2] < terrainVertMin * 800.0) {
    //     terrainVertMin--;
    //     for (let horIndex = terrainHorMin; horIndex <= terrainHorMax; horIndex++) {
    //         let newTerrainTile = new Terrain(program, horIndex, terrainVertMin, 256, 800.0);
    //         newTerrainTile.init();
    //         terrains.push(newTerrainTile);
    //     }
    // }

    light1.render();
    light2.render();

    terrains.forEach(terrain => terrain.render());

    camera.render(trackingMouse);

    requestAnimFrame(render);
}