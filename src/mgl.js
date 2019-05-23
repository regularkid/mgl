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

        this.cameraPos = new Vec3(0, 0, 0);
        this.cameraDir = new Vec3(0, 0, -1);
        this.viewMatrix = new Matrix4x4(new Vec3(1, 0, 0), new Vec3(0, 1, 0), new Vec3(0, 0, 1), new Vec3(0, 0, 0));

        this.lights = [];
    }

    PerspectiveProjection(p)
    {
        let zAbs = Math.abs(p.z);
        return new Vec3(this.screenHalfWidth + ((p.x / zAbs) * this.screenHalfWidthOverAspectRatio),
                        this.screenHalfHeight - ((p.y / zAbs) * this.screenHalfHeight),
                        zAbs);
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

            let xMin = Math.round(Math.min(poly.paScreen.x, Math.min(poly.pbScreen.x, poly.pcScreen.x)));
            let xMax = Math.round(Math.max(poly.paScreen.x, Math.max(poly.pbScreen.x, poly.pcScreen.x)));
            let yMin = Math.round(Math.min(poly.paScreen.y, Math.min(poly.pbScreen.y, poly.pcScreen.y)));
            let yMax = Math.round(Math.max(poly.paScreen.y, Math.max(poly.pbScreen.y, poly.pcScreen.y)));
            let p = new Vec3(0, 0, 0);
            let color = new Color(0, 0, 0);
            let colorTex = new Color(0, 0, 0);

            // Vales used for barycentric coordinates
            let w0, w1, w2 = 0.0;
            let triArea2Reciprocal = 1.0 / this.SignedParallelogramArea2D(poly.paScreen, poly.pbScreen, poly.pcScreen);

            // Values used to calculate perspective correct interpolation
            // let paColorOverZ = new Color(poly.paColor.r / poly.paScreen.z, poly.paColor.g / poly.paScreen.z, poly.paColor.b / poly.paScreen.z);
            // let pbColorOverZ = new Color(poly.pbColor.r / poly.pbScreen.z, poly.pbColor.g / poly.pbScreen.z, poly.pbColor.b / poly.pbScreen.z);
            // let pcColorOverZ = new Color(poly.pcColor.r / poly.pcScreen.z, poly.pcColor.g / poly.pcScreen.z, poly.pcColor.b / poly.pcScreen.z);
            // let ptColor = new Color(0.0, 0.0, 0.0);
            let paOneOverZ = 1.0 / poly.paScreen.z;
            let pbOneOverZ = 1.0 / poly.pbScreen.z;
            let pcOneOverZ = 1.0 / poly.pcScreen.z;
            let ptOneOverZ = 0.0;
            let paUVOverZ = new Vec3(poly.paUV.x / poly.paScreen.z, poly.paUV.y / poly.paScreen.z);
            let pbUVOverZ = new Vec3(poly.pbUV.x / poly.pbScreen.z, poly.pbUV.y / poly.pbScreen.z);
            let pcUVOverZ = new Vec3(poly.pcUV.x / poly.pcScreen.z, poly.pcUV.y / poly.pcScreen.z);
            let ptUV = new Vec3(0.0, 0.0, 0.0);

            // Values used for lighting
            let lightColor = new Color(0, 0, 0);
            this.lights.forEach(light =>
            {
                lightColor.r += light.ambient.r;
                lightColor.g += light.ambient.g;
                lightColor.b += light.ambient.b;

                let lightDirInv = this.viewMatrix.TransformDirection(light.dirInv);

                let intensity = Math.max(Math.min(lightDirInv.Dot(poly.normal), 1.0), 0.0);
                lightColor.r += intensity*light.diffuse.r;
                lightColor.g += intensity*light.diffuse.g;
                lightColor.b += intensity*light.diffuse.b;
            });

            for (let y = yMin; y <= yMax; y++)
            {
                for (let x = xMin; x <= xMax; x++)
                {
                    p.x = x;
                    p.y = y;

                    // Is point inside tri?
                    w0 = this.SignedParallelogramArea2D(poly.pbScreen, poly.pcScreen, p);
                    w1 = this.SignedParallelogramArea2D(poly.pcScreen, poly.paScreen, p);
                    w2 = this.SignedParallelogramArea2D(poly.paScreen, poly.pbScreen, p);

                    if (w0 > 0.0 && w1 > 0.0 && w2 > 0.0)
                    {
                        // Convert to barycentric coordinates
                        w0 *= triArea2Reciprocal;
                        w1 *= triArea2Reciprocal;
                        w2 *= triArea2Reciprocal;

                        // Perspective correct interpolation
                        ptOneOverZ = 1.0 / (paOneOverZ*w0 + pbOneOverZ*w1 + pcOneOverZ*w2);

                        // Color
                        // ptColor.r = (paColorOverZ.r*w0 + pbColorOverZ.r*w1 + pcColorOverZ.r*w2) * ptOneOverZ;
                        // ptColor.g = (paColorOverZ.g*w0 + pbColorOverZ.g*w1 + pcColorOverZ.g*w2) * ptOneOverZ;
                        // ptColor.b = (paColorOverZ.b*w0 + pbColorOverZ.b*w1 + pcColorOverZ.b*w2) * ptOneOverZ;
                        //this.framebuffer32Bit[(y * this.screenWidth) + x] = ptColor.Get32Bit(w0);

                        // Texture
                        ptUV.x = (paUVOverZ.x*w0 + pbUVOverZ.x*w1 + pcUVOverZ.x*w2) * ptOneOverZ;
                        ptUV.y = (paUVOverZ.y*w0 + pbUVOverZ.y*w1 + pcUVOverZ.y*w2) * ptOneOverZ;
                        colorTex = poly.texture.GetPixelRGB(ptUV);
                        color.r = colorTex.r * lightColor.r;
                        color.g = colorTex.g * lightColor.g;
                        color.b = colorTex.b * lightColor.b;
                        this.framebuffer32Bit[(y * this.screenWidth) + x] = color.Get32Bit();
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
            // Local -> World
            let paWorld = obj.tm.TransformPoint(obj.verts[obj.indices[i]]);
            let pbWorld = obj.tm.TransformPoint(obj.verts[obj.indices[i + 1]]);
            let pcWorld = obj.tm.TransformPoint(obj.verts[obj.indices[i + 2]]);

            // World -> Camera
            paWorld = this.viewMatrix.TransformPoint(paWorld);
            pbWorld = this.viewMatrix.TransformPoint(pbWorld);
            pcWorld = this.viewMatrix.TransformPoint(pcWorld);

            // Cull backfaces
            let pabWorld = pbWorld.Sub(paWorld);
            let pbcWorld = pcWorld.Sub(pbWorld);
            let normal = pabWorld.Cross(pbcWorld);
            if (normal.Dot(paWorld) >= 0 &&
                normal.Dot(pbWorld) >= 0 &&
                normal.Dot(pcWorld) >= 0)
            {
                continue;
            }

            normal.NormalizeSelf();

            // Camera -> Screen
            this.polys.push(new Polygon(paWorld, pbWorld, pcWorld,
                                        this.PerspectiveProjection(paWorld),
                                        this.PerspectiveProjection(pbWorld),
                                        this.PerspectiveProjection(pcWorld),
                                        obj.colors[obj.indices[i]],
                                        obj.colors[obj.indices[i + 1]],
                                        obj.colors[obj.indices[i + 2]],
                                        obj.uvs[obj.indices[i]],
                                        obj.uvs[obj.indices[i + 1]],
                                        obj.uvs[obj.indices[i + 2]],
                                        normal,
                                        obj.texture));
        }
    }

    SignedParallelogramArea2D(pa, pb, pc) 
    { 
        return (pc.x - pa.x)*(pb.y - pa.y) - (pc.y - pa.y)*(pb.x - pa.x); 
    }

    SetCameraLookAt(pos, target, up)
    {
        let zAxis = pos.Sub(target).Normalize();
        let xAxis = up.Cross(zAxis).Normalize();
        let yAxis = zAxis.Cross(xAxis).Normalize();

        this.cameraPos = pos;
        this.cameraDir = zAxis.Invert();

        this.viewMatrix.c0 = new Vec3(xAxis.x, yAxis.x, zAxis.x);
        this.viewMatrix.c1 = new Vec3(xAxis.y, yAxis.y, zAxis.y);
        this.viewMatrix.c2 = new Vec3(xAxis.z, yAxis.z, zAxis.z);
        this.viewMatrix.c3 = new Vec3(-pos.Dot(xAxis), -pos.Dot(yAxis), -pos.Dot(zAxis));
    }
}