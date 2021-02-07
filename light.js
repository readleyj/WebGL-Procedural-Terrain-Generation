class Light {
    constructor(program, position) {
        this.program = program;
        this.position = position;
        this.intensity = {
            ambient: vec3(0.4, 0.4, 0.4),
            diffuse: vec3(1.0, 1.0, 1.0),
            specular: vec3(1.0, 1.0, 1.0)
        }
        this.lightCounter = Light.counter;
        Light.counter++;
    }

    render() {
        var pos = gl.getUniformLocation(this.program, "v_Light" + this.lightCounter);
        gl.uniform4fv(pos, flatten(this.position));

        var ambient = gl.getUniformLocation(this.program, "light_Ambient" + this.lightCounter);
        gl.uniform3fv(ambient, flatten(this.intensity.ambient));

        var diffuse = gl.getUniformLocation(this.program, "light_Diffuse" + this.lightCounter);
        gl.uniform3fv(diffuse, flatten(this.intensity.diffuse));

        var specular = gl.getUniformLocation(this.program, "light_Specular" + this.lightCounter);
        gl.uniform3fv(specular, flatten(this.intensity.specular));
    }
}

Light.counter = 0;