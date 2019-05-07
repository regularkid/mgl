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
        this.polys.sort((a, b) => b.zAvg - a.zAvg);

        for (let i = 0; i < this.polys.length; i++)
        {
            let poly = this.polys[i];

            let points = [poly.pa, poly.pb, poly.pc];
            points.sort((a, b) => b.y - a.y);

            let top = Math.round(points[0].y);
            let middle = Math.round(points[1].y);
            let bottom = Math.round(points[2].y);

            let totalHeight = top - bottom;
            let bottomToMiddleHeight = middle - bottom;
            let middleToTopHeight = top - middle;
            let yOffset = 0;
            let tLeft = 0;
            let left = 0;
            let tRight = 0;
            let right = 0;
            for (let y = bottom; y <= top; y++)
            {
                yOffset = y - bottom;

                tLeft = yOffset / totalHeight;
                left = Math.round(points[2].x + (points[0].x - points[2].x)*tLeft);

                if (y >= middle)
                {
                    tRight = (y - middle) / middleToTopHeight;
                    right = Math.round(points[1].x + (points[0].x - points[1].x)*tRight);
                }
                else
                {
                    tRight = yOffset / bottomToMiddleHeight;
                    right = Math.round(points[2].x + (points[1].x - points[2].x)*tRight);
                }

                if (right < left) { let t = left; left = right; right = t; }

                let pixelIdx = (y * this.canvas.width) + left;
                let pixelIdxEnd = (y * this.canvas.width) + right;
                while (pixelIdx <= pixelIdxEnd)
                {
                    this.framebuffer32Bit[pixelIdx] = poly.color;
                    pixelIdx++;
                }
            }
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
            if (dot <= 0)
            {
                continue;
            }

            this.polys.push(new Polygon(this.PerspectiveProjection(pa),
                                        this.PerspectiveProjection(pb),
                                        this.PerspectiveProjection(pc),
                                        obj.colors[i]));
        }
    }
}