class Cube
{
    constructor(center, halfSize, texture)
    {
        this.verts = [];
        this.verts.push(new Vec3(-halfSize, -halfSize, halfSize));
        this.verts.push(new Vec3(halfSize, -halfSize, halfSize));
        this.verts.push(new Vec3(halfSize, -halfSize, -halfSize));
        this.verts.push(new Vec3(-halfSize, -halfSize, -halfSize));
        this.verts.push(new Vec3(-halfSize, halfSize, halfSize));
        this.verts.push(new Vec3(halfSize, halfSize, halfSize));
        this.verts.push(new Vec3(halfSize, halfSize, -halfSize));
        this.verts.push(new Vec3(-halfSize, halfSize, -halfSize));

        this.indices = [];
        this.indices.push(0); this.indices.push(1); this.indices.push(4);
        this.indices.push(1); this.indices.push(5); this.indices.push(4);
        this.indices.push(1); this.indices.push(2); this.indices.push(5);
        this.indices.push(2); this.indices.push(6); this.indices.push(5);
        this.indices.push(2); this.indices.push(3); this.indices.push(6);
        this.indices.push(3); this.indices.push(7); this.indices.push(6);
        this.indices.push(3); this.indices.push(0); this.indices.push(7);
        this.indices.push(0); this.indices.push(4); this.indices.push(7);
        this.indices.push(4); this.indices.push(5); this.indices.push(7);
        this.indices.push(5); this.indices.push(6); this.indices.push(7);
        this.indices.push(3); this.indices.push(2); this.indices.push(0);
        this.indices.push(2); this.indices.push(1); this.indices.push(0);

        this.uvs = [];
        this.uvs.push(new Vec3(0.0, 0.0));
        this.uvs.push(new Vec3(1.0, 0.0));
        this.uvs.push(new Vec3(0.0, 0.0));
        this.uvs.push(new Vec3(1.0, 0.0));
        this.uvs.push(new Vec3(0.0, 1.0));
        this.uvs.push(new Vec3(1.0, 1.0));
        this.uvs.push(new Vec3(0.0, 1.0));
        this.uvs.push(new Vec3(1.0, 1.0));

        this.texture = texture;

        this.tm = new Matrix4x4(new Vec3(1, 0, 0),
                                new Vec3(0, 1, 0),
                                new Vec3(0, 0, 1),
                                center);
    }
}