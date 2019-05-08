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
            let triArea2Reciprocal = 1.0 / this.SignedParallelogramArea(poly.pa, poly.pb, poly.pc);
            for (let y = yMin; y <= yMax; y++)
            {
                for (let x = xMin; x <= xMax; x++)
                {
                    p.x = x;
                    p.y = y;


                    w0 = this.SignedParallelogramArea(poly.pa, poly.pb, p);
                    w1 = this.SignedParallelogramArea(poly.pb, poly.pc, p);
                    w2 = this.SignedParallelogramArea(poly.pc, poly.pa, p);

                    if (w0 > 0.0 && w1 > 0.0 && w2 > 0.0)
                    {
                        // Convert to barycentric coordinates
                        w0 *= triArea2Reciprocal;
                        w1 *= triArea2Reciprocal;
                        w2 *= triArea2Reciprocal;

                        this.framebuffer32Bit[(y * this.canvas.width) + x] = poly.paColor;//*w0 + poly.pbColor*w1 + poly.pcColor*w2;
                    }
                }
            }

            // let points = [poly.pa, poly.pb, poly.pc];
            // points.sort((a, b) => b.y - a.y);

            // let top = Math.round(points[0].y);
            // let middle = Math.round(points[1].y);
            // let bottom = Math.round(points[2].y);

            // let totalHeight = top - bottom;
            // let bottomToMiddleHeight = middle - bottom;
            // let middleToTopHeight = top - middle;
            // let yOffset = 0;
            // let tLeft = 0;
            // let left = 0;
            // let tRight = 0;
            // let right = 0;
            // for (let y = bottom; y <= top; y++)
            // {
            //     yOffset = y - bottom;

            //     tLeft = yOffset / totalHeight;
            //     left = Math.round(points[2].x + (points[0].x - points[2].x)*tLeft);

            //     if (y >= middle)
            //     {
            //         tRight = (y - middle) / middleToTopHeight;
            //         right = Math.round(points[1].x + (points[0].x - points[1].x)*tRight);
            //     }
            //     else
            //     {
            //         tRight = yOffset / bottomToMiddleHeight;
            //         right = Math.round(points[2].x + (points[1].x - points[2].x)*tRight);
            //     }

            //     if (right < left) { let t = left; left = right; right = t; }

            //     let pixelIdx = (y * this.canvas.width) + left;
            //     let pixelIdxEnd = (y * this.canvas.width) + right;
            //     while (pixelIdx <= pixelIdxEnd)
            //     {
            //         this.framebuffer32Bit[pixelIdx] = poly.paColor;
            //         pixelIdx++;
            //     }
            // }
        }

        this.ctx.putImageData(this.framebuffer, 0, 0);
    }

    RenderObject(obj, color)
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