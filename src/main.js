var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d", { alpha: false });
var lastTime = 0;
var mgl = new MGL(canvas, ctx, 800/600);
var cube = new Cube(new Vec3(0, 0, 5.0), 1.0);

function GameLoop(curTime)
{
    let dt = Math.min((curTime - lastTime) / 1000.0, 0.2);	
    lastTime = curTime;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // let numTris = 1000;
    // let colors = ["#F00", "#0F0", "#00F", "#FF0", "#F0F", "#0FF"];
    // for (let i = 0; i < numTris; i++)
    // {
    //     let randColorIdx = Math.floor(Math.random()*colors.length);
    //     ctx.fillStyle = colors[randColorIdx];
    //     ctx.beginPath();

    //     let x = Math.random()*canvas.width;
    //     let y = Math.random()*canvas.height;
    //     ctx.moveTo(x, y);
    //     ctx.lineTo(x + Math.random()*100, y + Math.random()*100);
    //     ctx.lineTo(x + Math.random()*100, y + Math.random()*100);
    //     ctx.fill();
    // }

    mgl.RenderObject(cube, "#F00");

    //TEMP!	
    ctx.font = `Bold 16px Arial`;	
    ctx.fillStyle = "#FFF";	
    let fps = 1.0 / dt;
    ctx.fillText(`${Math.floor(fps)}`, 10, 20);

    window.requestAnimationFrame(GameLoop);
}

window.requestAnimationFrame(GameLoop);