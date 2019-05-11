class Cube
{
    constructor(center, halfSize)
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

        this.colors = [];
        this.colors.push(new Color(1.0, 0.0, 0.0));
        this.colors.push(new Color(0.0, 1.0, 0.0));
        this.colors.push(new Color(0.0, 0.0, 1.0));
        this.colors.push(new Color(1.0, 1.0, 0.0));
        this.colors.push(new Color(1.0, 0.0, 1.0));
        this.colors.push(new Color(0.0, 1.0, 1.0));
        this.colors.push(new Color(1.0, 1.0, 1.0));
        this.colors.push(new Color(0.5, 0.5, 0.5));

        this.tm = new Matrix4x4(new Vec3(1, 0, 0),
                                new Vec3(0, 1, 0),
                                new Vec3(0, 0, 1),
                                center);
    }
}