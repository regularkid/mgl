let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d", { alpha: false });
let input = new Input(canvas);
let lastTime = 0;
let mgl = new MGL(canvas, ctx, canvas.width / canvas.height, 0xFFFFC9BF);
let scene = new Scene(mgl, input);

function GameLoop(curTime)
{
    let dt = Math.min((curTime - lastTime) / 1000.0, 0.2);	
    lastTime = curTime;

    scene.Update(dt);

    mgl.ClearBuffers();
    scene.Render();
    mgl.RenderBuffers();

    //TEMP!	
    // ctx.font = `Bold 16px Arial`;	
    // ctx.fillStyle = "#FFF";	
    // let fps = 1.0 / dt;
    // ctx.fillText(`${Math.floor(fps)}`, 10, 20);

    input.PostUpdate();
    window.requestAnimationFrame(GameLoop);
}

window.requestAnimationFrame(GameLoop);