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
                        -((p.y / p.z) * this.screenHalfHeight) + this.screenHalfHeight,
                        p.z);
    }

    ClearBuffers()
    {
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.polys = [];
    }

    RenderBuffers()
    {
        this.polys.sort((a, b) => b.zAvg - a.zAvg);

        for (let i = 0; i < this.polys.length; i++)
        {
            let poly = this.polys[i];

            this.ctx.fillStyle = poly.color;
            this.ctx.beginPath();

            this.ctx.moveTo(poly.pa.x, poly.pa.y);
            this.ctx.lineTo(poly.pb.x, poly.pb.y);
            this.ctx.lineTo(poly.pc.x, poly.pc.y);

            this.ctx.fill();
        }
    }

    RenderObject(obj, color)
    {
        for (let i = 0; i < obj.indices.length; i += 3)
        {
            let pa = obj.tm.TransformPoint(obj.verts[obj.indices[i]]);
            let pb = obj.tm.TransformPoint(obj.verts[obj.indices[i + 1]]);
            let pc = obj.tm.TransformPoint(obj.verts[obj.indices[i + 2]]);

            this.polys.push(new Polygon(this.PerspectiveProjection(pa),
                                        this.PerspectiveProjection(pb),
                                        this.PerspectiveProjection(pc),
                                        obj.colors[i]));
        }
    }
}