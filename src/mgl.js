class MGL
{
    constructor(canvas, ctx, aspectRatio)
    {
        this.canvas = canvas;
        this.ctx = ctx;
        this.screenWidth = this.canvas.width;
        this.screenHeight = this.canvas.height;
        this.screenHalfWidth = Math.floor(this.screenWidth * 0.5);
        this.screenHalfHeight = Math.floor(this.screenHeight * 0.5);

        this.framebuffer = ctx.getImageData(0, 0, this.screenWidth, this.screenHeight);
        this.framebuffer32Bit = new Uint32Array(this.framebuffer.data.buffer);

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
            let w0, w1, w2 = 0.0;
            let triArea2Reciprocal = 1.0 / this.SignedParallelogramArea(poly.pa, poly.pb, poly.pc);
            let paColorOverZ = new Color(poly.paColor.r / poly.pa.z, poly.paColor.g / poly.pa.z, poly.paColor.b / poly.pa.z);
            let pbColorOverZ = new Color(poly.pbColor.r / poly.pb.z, poly.pbColor.g / poly.pb.z, poly.pbColor.b / poly.pb.z);
            let pcColorOverZ = new Color(poly.pcColor.r / poly.pc.z, poly.pcColor.g / poly.pc.z, poly.pcColor.b / poly.pc.z);
            let ptColor = new Color(0.0, 0.0, 0.0);
            let paOneOverZ = 1.0 / poly.pa.z;
            let pbOneOverZ = 1.0 / poly.pb.z;
            let pcOneOverZ = 1.0 / poly.pc.z;
            let ptOneOverZ = 0.0;

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

                        // Perspective correct interpolation
                        ptOneOverZ = 1.0 / (paOneOverZ*w0 + pbOneOverZ*w1 + pcOneOverZ*w2);
                        ptColor.r = (paColorOverZ.r*w0 + pbColorOverZ.r*w1 + pcColorOverZ.r*w2) * ptOneOverZ;
                        ptColor.g = (paColorOverZ.g*w0 + pbColorOverZ.g*w1 + pcColorOverZ.g*w2) * ptOneOverZ;
                        ptColor.b = (paColorOverZ.b*w0 + pbColorOverZ.b*w1 + pcColorOverZ.b*w2) * ptOneOverZ;

                        this.framebuffer32Bit[(y * this.screenWidth) + x] = ptColor.Get32Bit(w0);
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