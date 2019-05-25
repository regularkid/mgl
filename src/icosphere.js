class Icosphere
{
    constructor(center, radius, texture)
    {
        // http://blog.andreaskahler.com/2009/06/creating-icosphere-mesh-in-code.html
        let t = (1.0 + Math.sqrt(5.0)) / 2.0;

        this.verts = [];
        this.verts.push(new Vec3(-1.0, t, 0.0));
        this.verts.push(new Vec3(1.0, t, 0.0));
        this.verts.push(new Vec3(-1.0, -t, 0.0));
        this.verts.push(new Vec3(1.0, -t, 0.0));

        this.verts.push(new Vec3(0.0, -1.0, t));
        this.verts.push(new Vec3(0.0, 1.0, t));
        this.verts.push(new Vec3(0.0, -1.0, -t));
        this.verts.push(new Vec3(0.0, 1.0, -t));

        this.verts.push(new Vec3(t, 0.0, -1.0));
        this.verts.push(new Vec3(t, 0.0, 1.0));
        this.verts.push(new Vec3(-t, 0.0, -1.0));
        this.verts.push(new Vec3(-t, 0.0, 1.0));

        this.indices = [];
        this.indices.push(0); this.indices.push(11); this.indices.push(5);
        this.indices.push(0); this.indices.push(5); this.indices.push(1);
        this.indices.push(0); this.indices.push(1); this.indices.push(7);
        this.indices.push(0); this.indices.push(7); this.indices.push(10);
        this.indices.push(0); this.indices.push(10); this.indices.push(11);

        this.indices.push(1); this.indices.push(5); this.indices.push(9);
        this.indices.push(5); this.indices.push(11); this.indices.push(4);
        this.indices.push(11); this.indices.push(10); this.indices.push(2);
        this.indices.push(10); this.indices.push(7); this.indices.push(6);
        this.indices.push(7); this.indices.push(1); this.indices.push(8);

        this.indices.push(3); this.indices.push(9); this.indices.push(4);
        this.indices.push(3); this.indices.push(4); this.indices.push(2);
        this.indices.push(3); this.indices.push(2); this.indices.push(6);
        this.indices.push(3); this.indices.push(6); this.indices.push(8);
        this.indices.push(3); this.indices.push(8); this.indices.push(9);

        this.indices.push(4); this.indices.push(9); this.indices.push(5);
        this.indices.push(2); this.indices.push(4); this.indices.push(11);
        this.indices.push(6); this.indices.push(2); this.indices.push(10);
        this.indices.push(8); this.indices.push(6); this.indices.push(7);
        this.indices.push(9); this.indices.push(8); this.indices.push(1);

        // I don't know how to texture icosphere yet - just assume solid color texture for now
        this.uvs = [];
        this.uvs.push(new Vec3(0.0, 0.0));
        this.uvs.push(new Vec3(0.0, 0.0));
        this.uvs.push(new Vec3(0.0, 0.0));
        this.uvs.push(new Vec3(0.0, 0.0));
        this.uvs.push(new Vec3(0.0, 0.0));
        this.uvs.push(new Vec3(0.0, 0.0));
        this.uvs.push(new Vec3(0.0, 0.0));
        this.uvs.push(new Vec3(0.0, 0.0));
        this.uvs.push(new Vec3(0.0, 0.0));
        this.uvs.push(new Vec3(0.0, 0.0));
        this.uvs.push(new Vec3(0.0, 0.0));
        this.uvs.push(new Vec3(0.0, 0.0));

        this.texture = texture;

        this.tm = new Matrix4x4(new Vec3(radius, 0, 0),
                                new Vec3(0, radius, 0),
                                new Vec3(0, 0, radius),
                                center);
    }
}