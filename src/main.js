let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d", { alpha: false });
let lastTime = 0;
let mgl = new MGL(canvas, ctx, 800/600);
let texWall = new Texture("./textures/wall.png");
let cube = new Cube(new Vec3(0, 0, -5.0), 1.0, texWall);
mgl.lights.push(new Light(new Vec3(1.0, 0.0, 0.0), 0.4, 2.0));

function GameLoop(curTime)
{
    let dt = Math.min((curTime - lastTime) / 1000.0, 0.2);	
    lastTime = curTime;

    mgl.ClearBuffers();

    // DEBUG
    let rotateAngle = (90.0 * (Math.PI / 180.0)) * dt;
    let cosAngle = Math.cos(rotateAngle);
    let sinAngle = Math.sin(rotateAngle);
    let tmRotate = new Matrix4x4(new Vec3(cosAngle, 0.0, sinAngle),
                                 new Vec3(0.0, 1.0, 0.0),
                                 new Vec3(-sinAngle, 0.0, cosAngle),
                                 new Vec3(0.0, 0.0, 0.0));

    rotateAngle = (45.0 * (Math.PI / 180.0)) * dt;
    cosAngle = Math.cos(rotateAngle);
    sinAngle = Math.sin(rotateAngle);
    let tmRotate2 = new Matrix4x4(new Vec3(1.0, 0.0, 0.0),
                                 new Vec3(0.0, cosAngle, -sinAngle),
                                 new Vec3(0.0, sinAngle, cosAngle),
                                 new Vec3(0.0, 0.0, 0.0));

    tmRotate.MultiplyMatrix4x4Self(tmRotate2);

    cube.tm = cube.tm.MultiplyMatrix4x4(tmRotate);

    mgl.RenderObject(cube, "#F00");

    mgl.RenderBuffers();

    //TEMP!	
    ctx.font = `Bold 16px Arial`;	
    ctx.fillStyle = "#FFF";	
    let fps = 1.0 / dt;
    ctx.fillText(`${Math.floor(fps)}`, 10, 20);

    window.requestAnimationFrame(GameLoop);
}

window.requestAnimationFrame(GameLoop);