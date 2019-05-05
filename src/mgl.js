class MGL
{
    constructor(canvas, ctx, aspectRatio)
    {
        this.ctx = ctx;
        this.screenHalfWidth = Math.floor(canvas.width * 0.5);
        this.screenHalfHeight = Math.floor(canvas.height * 0.5);
        this.screenHalfWidthOverAspectRatio = this.screenHalfWidth / aspectRatio;
        this.viewPlaneHalfWidth = aspectRatio;
        this.viewPlaneHalfHeight = 1.0;
    }

    PerspectiveProjection(p)
    {
        return new Vec3(((p.x / p.z) * this.screenHalfWidthOverAspectRatio) + this.screenHalfWidth,
                        ((p.y / p.z) * this.screenHalfHeight) + this.screenHalfHeight,
                        0.0);
    }

    RenderObject(obj, color)
    {
        for (let i = 0; i < obj.indices.length; i += 3)
        {
            this.ctx.fillStyle = color;
            this.ctx.beginPath();

            let pa = this.PerspectiveProjection(obj.verts[obj.indices[i]]);
            let pb = this.PerspectiveProjection(obj.verts[obj.indices[i + 1]]);
            let pc = this.PerspectiveProjection(obj.verts[obj.indices[i + 2]]);

            this.ctx.moveTo(pa.x, pa.y);
            this.ctx.lineTo(pb.x, pb.y);
            this.ctx.lineTo(pc.x, pc.y);

            this.ctx.fill();
        }
    }
}