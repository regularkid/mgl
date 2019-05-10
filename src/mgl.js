class MGL
{
    constructor(canvas, ctx, aspectRatio)
    {
        this.canvas = canvas;
        this.ctx = ctx;
        this.framebuffer = ctx.getImageData(0, 0, canvas.width, canvas.height);
        this.framebuffer32Bit = new Uint32Array(this.framebuffer.data.buffer);

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
        this.framebuffer32Bit.fill(0xFF000000);
        this.polys = [];
    }

    RenderBuffers()
    {
        this.polys.sort((a, b) => a.zAvg - b.zAvg);

        for (let i = 0; i < this.polys.length; i++)
        {
            let poly = this.polys[i];

            let xMin = Math.round(Math.min(poly.pa.x, Math.min(poly.pb.x, poly.pc.x)));
            let xMax = Math.round(Math.max(poly.pa.x, Math.max(poly.pb.x, poly.pc.x)));
            let yMin = Math.round(Math.min(poly.pa.y, Math.min(poly.pb.y, poly.pc.y)));
            let yMax = Math.round(Math.max(poly.pa.y, Math.max(poly.pb.y, poly.pc.y)));

            let p = new Vec3(0, 0, 0);
            let w0 = 0;
            let w1 = 0;
            let w2 = 0;
            let r = 0;
            let g = 0;
            let b = 0;
            let triArea2Reciprocal = 1.0 / this.SignedParallelogramArea(poly.pa, poly.pb, poly.pc);
            for (let y = yMin; y <= yMax; y++)
            {
                for (let x = xMin; x <= xMax; x++)
                {
                    p.x = x;
                    p.y = y;


                    w0 = this.SignedParallelogramArea(poly.pb, poly.pc, p);
                    w1 = this.SignedParallelogramArea(poly.pc, poly.pa, p);
                    w2 = this.SignedParallelogramArea(poly.pa, poly.pb, p);

                    if (w0 > 0.0 && w1 > 0.0 && w2 > 0.0)
                    {
                        // Convert to barycentric coordinates
                        w0 *= triArea2Reciprocal;
                        w1 *= triArea2Reciprocal;
                        w2 *= triArea2Reciprocal;

                        this.framebuffer32Bit[(y * this.canvas.width) + x] = poly.paColor.Get32BitMultiplied(w0) +
                                                                             poly.pbColor.Get32BitMultiplied(w1) +
                                                                             poly.pcColor.Get32BitMultiplied(w2);
                    }
                }
            }
        }

        this.ctx.putImageData(this.framebuffer, 0, 0);
    }

    RenderObject(obj)
    {
        for (let i = 0; i < obj.indices.length; i += 3)
        {
            let pa = obj.tm.TransformPoint(obj.verts[obj.indices[i]]);
            let pb = obj.tm.TransformPoint(obj.verts[obj.indices[i + 1]]);
            let pc = obj.tm.TransformPoint(obj.verts[obj.indices[i + 2]]);

            // Cull backfaces
            let pab = pb.Sub(pa);
            let pbc = pc.Sub(pb);
            let n = pab.Cross(pbc);
            let dot = n.Dot(pa);
            if (dot >= 0)
            {
                continue;
            }

            this.polys.push(new Polygon(this.PerspectiveProjection(pa),
                                        this.PerspectiveProjection(pb),
                                        this.PerspectiveProjection(pc),
                                        obj.colors[obj.indices[i]],
                                        obj.colors[obj.indices[i + 1]],
                                        obj.colors[obj.indices[i + 2]]));
        }
    }

    SignedParallelogramArea(pa, pb, pc) 
    { 
        return (pc.x - pa.x)*(pb.y - pa.y) - (pc.y - pa.y)*(pb.x - pa.x); 
    }
}