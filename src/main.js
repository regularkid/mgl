let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d", { alpha: false });
let input = new Input(canvas);
let lastTime = 0;
let mgl = new MGL(canvas, ctx, 800/600);
let texWall = new Texture("./textures/wall.png");
let cube = new Cube(new Vec3(0, 0.1, -5.0), 1.0, texWall);
let cube2 = new Cube(new Vec3(0.5, 0.1, -6.0), 1.0, texWall);
mgl.lights.push(new Light(new Vec3(-1.0, 0.0, 0.0), new Color(0.3, 0.3, 0.3), new Color(1.0, 1.0, 1.0)));
mgl.lights.push(new Light(new Vec3(0.0, -1.0, 0.0), new Color(0.3, 0.3, 0.3), new Color(1.0, 1.0, 1.0)));
let lightColorsOn = false;

let cameraPos = new Vec3(0, 0, 0);
let cameraTarget = new Vec3(0, 0, -5);
let cameraUp = new Vec3(0, 1, 0);
let cameraAngleH = 0.0;
let cameraAngleV = 30.0;
let cameraDistance = 5.0;
let cameraRotateSpeed = 0.5;
let cameraPanSpeed = 0.1;
let cameraMaxAngleV = 60.0;

function GameLoop(curTime)
{
    let dt = Math.min((curTime - lastTime) / 1000.0, 0.2);	
    lastTime = curTime;

    if (input.isTouchActive)
    {
        if (input.buttonIdx === 0)
        {
            cameraAngleH += input.dx * cameraRotateSpeed;
            cameraAngleV = Math.max(Math.min(cameraAngleV + input.dy * cameraRotateSpeed, cameraMaxAngleV), -cameraMaxAngleV);
        }
        else if (input.buttonIdx === 1)
        {
            let cameraRight = mgl.cameraDir.Cross(cameraUp);
            let cameraUpNew = cameraRight.Cross(mgl.cameraDir);
            cameraTarget.AddToSelf(cameraRight.Scale(-input.dx * cameraPanSpeed));
            cameraTarget.AddToSelf(cameraUpNew.Scale(input.dy * cameraPanSpeed));
        }
    }

    let cameraDistanceH = Math.cos(cameraAngleV*Math.PI/180.0) * cameraDistance;
    let cameraOffset = new Vec3(Math.cos(cameraAngleH*Math.PI/180.0) * cameraDistanceH,
                                Math.sin(cameraAngleV*Math.PI/180.0) * cameraDistance,
                                Math.sin(cameraAngleH*Math.PI/180.0) * cameraDistanceH);

    cameraPos = cameraTarget.Add(cameraOffset);

    mgl.SetCameraLookAt(cameraPos, cameraTarget, cameraUp);

    // DEBUG
    let rotateAngle = (90.0 * (Math.PI / 180.0)) * dt;
    let cosAngle = Math.cos(rotateAngle);
    let sinAngle = Math.sin(rotateAngle);
    let tmRotate = new Matrix4x4(new Vec3(cosAngle, 0.0, -sinAngle),
                                 new Vec3(0.0, 1.0, 0.0),
                                 new Vec3(sinAngle, 0.0, cosAngle),
                                 new Vec3(0.0, 0.0, 0.0));

    rotateAngle = (45.0 * (Math.PI / 180.0)) * dt;
    cosAngle = Math.cos(rotateAngle);
    sinAngle = Math.sin(rotateAngle);
    let tmRotate2 = new Matrix4x4(new Vec3(1.0, 0.0, 0.0),
                                 new Vec3(0.0, cosAngle, sinAngle),
                                 new Vec3(0.0, -sinAngle, cosAngle),
                                 new Vec3(0.0, 0.0, 0.0));

    tmRotate.MultiplyMatrix4x4Self(tmRotate2);

    cube.tm = cube.tm.MultiplyMatrix4x4(tmRotate);

    mgl.ClearBuffers();
    mgl.RenderObject(cube, "#F00");
    mgl.RenderObject(cube2, "#F00");
    mgl.RenderBuffers();

    //TEMP!	
    ctx.font = `Bold 16px Arial`;	
    ctx.fillStyle = "#FFF";	
    let fps = 1.0 / dt;
    ctx.fillText(`${Math.floor(fps)}`, 10, 20);

    input.PostUpdate();
    window.requestAnimationFrame(GameLoop);
}

window.requestAnimationFrame(GameLoop);

function ToggleLightColors()
{
    lightColorsOn = !lightColorsOn;
    if (lightColorsOn)
    {
        mgl.lights[0].ambient = new Color(0.3, 1.0, 0.3);
        mgl.lights[0].diffuse = new Color(0.4, 10.0, 0.4);

        mgl.lights[1].ambient = new Color(0.4, 0.4, 1.0);
        mgl.lights[1].diffuse = new Color(0.4, 0.4, 10.0);
    }
    else
    {
        mgl.lights[0].ambient = new Color(0.3, 0.3, 0.3);
        mgl.lights[0].diffuse = new Color(1.0, 1.0, 1.0);

        mgl.lights[1].ambient = new Color(0.3, 0.3, 0.3);
        mgl.lights[1].diffuse = new Color(1.0, 1.0, 1.0);
    }
}