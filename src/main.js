var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d", { alpha: false });
var lastTime = 0;
var mgl = new MGL(canvas, ctx, 800/600);
var cube = new Cube(new Vec3(0, 0, -5.0), 1.0);

function GameLoop(curTime)
{
    let dt = Math.min((curTime - lastTime) / 1000.0, 0.2);	
    lastTime = curTime;

    mgl.ClearBuffers();

    // DEBUG
    var rotateAngle = (180.0 * (Math.PI / 180.0)) * dt;
    var cosAngle = Math.cos(rotateAngle);
    var sinAngle = Math.sin(rotateAngle);
    var tmRotate = new Matrix4x4(new Vec3(cosAngle, 0.0, sinAngle),
                                 new Vec3(0.0, 1.0, 0.0),
                                 new Vec3(-sinAngle, 0.0, cosAngle),
                                 new Vec3(0.0, 0.0, 0.0));

    rotateAngle = (90.0 * (Math.PI / 180.0)) * dt;
    cosAngle = Math.cos(rotateAngle);
    sinAngle = Math.sin(rotateAngle);
    var tmRotate2 = new Matrix4x4(new Vec3(1.0, 0.0, 0.0),
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