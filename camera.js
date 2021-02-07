class Camera {
    SPEED = 25.0

    constructor(program, position, target, up) {
        this.program = program;
        this.position = position;
        this.initPosition = position;
        this.target = target;
        this.initTarget = target;
        this.up = up;
        this.initUp = up;
        this.front = vec3(0.0, 0.0, -1.0);
        this.initFront = this.front;
    }

    render() {
        var pos = gl.getUniformLocation(this.program, "v_Camera");
        gl.uniform4fv(pos, flatten(vec4(this.position, 1.0)));

        var view = gl.getUniformLocation(this.program, "m_View");

        var matView = lookAt(this.position, add(this.position, this.front), this.up);
        gl.uniformMatrix4fv(view, false, flatten(matView));

        var proj = gl.getUniformLocation(this.program, "m_Proj");
        var matProj = perspective(60.0, 1.0, 1.0, 10000);
        gl.uniformMatrix4fv(proj, false, flatten(matProj));
    }

    rotateCam(angle, axis) {
        this.position = vec3(mult_v(rotate(angle, axis), vec4(camera.position)));
        this.front = vec3(mult_v(rotate(angle, axis), vec4(camera.front)));
        this.up = vec3(mult_v(rotate(angle, axis), vec4(camera.up)));
    }

    translateCam(x, y, z) {
        this.position = vec3(mult_v(translate(x, y, z), vec4(this.position)));
    }

    reset() {
        this.position = this.initPosition;
        this.target = this.initTarget;
        this.up = this.initUp;
        this.front = this.initFront;
    }

    moveTrackball(xOffset, yOffset) {
        let axis;

        this.translateCam(-400, 0, -400)

        axis = vec3(0, 1, 0);
        this.rotateCam(xOffset * 0.4, axis)
        axis = vec3(1, 0, 0)
        this.rotateCam(yOffset * 0.4, axis)

        this.translateCam(400, 0, 400)
    }
}