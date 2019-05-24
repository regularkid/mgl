class Plane
{
    constructor(p1, p2, p3, p4, texture)
    {
        this.verts = [];
        this.verts.push(new Vec3(p1.x, p1.y, p1.z));
        this.verts.push(new Vec3(p2.x, p2.y, p2.z));
        this.verts.push(new Vec3(p3.x, p3.y, p3.z));
        this.verts.push(new Vec3(p4.x, p4.y, p4.z));

        this.indices = [];
        this.indices.push(0); this.indices.push(1); this.indices.push(2);
        this.indices.push(0); this.indices.push(2); this.indices.push(3);

        this.uvs = [];
        this.uvs.push(new Vec3(0.0, 0.0));
        this.uvs.push(new Vec3(1.0, 0.0));
        this.uvs.push(new Vec3(1.0, 1.0));
        this.uvs.push(new Vec3(0.0, 1.0));

        this.texture = texture;

        let center = new Vec3(p1.x+p2.x+p3.x+p4.x, p1.y+p2.y+p3.y+p4.y, p1.z+p2.z+p3.z+p4.z);
        center.Scale(0.25);

        this.tm = new Matrix4x4(new Vec3(1, 0, 0),
                                new Vec3(0, 1, 0),
                                new Vec3(0, 0, 1),
                                center);
    }
}