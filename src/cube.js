class Cube
{
    constructor(center, halfSize)
    {
        this.verts = [];
        this.verts.push(center.Add(new Vec3(-halfSize, -halfSize, -halfSize)));
        this.verts.push(center.Add(new Vec3(halfSize, -halfSize, -halfSize)));
        this.verts.push(center.Add(new Vec3(halfSize, -halfSize, halfSize)));
        this.verts.push(center.Add(new Vec3(-halfSize, -halfSize, halfSize)));
        this.verts.push(center.Add(new Vec3(-halfSize, halfSize, -halfSize)));
        this.verts.push(center.Add(new Vec3(halfSize, halfSize, -halfSize)));
        this.verts.push(center.Add(new Vec3(halfSize, halfSize, halfSize)));
        this.verts.push(center.Add(new Vec3(-halfSize, halfSize, halfSize)));

        this.indices = [];
        this.indices.push(0); this.indices.push(1); this.indices.push(4);
        this.indices.push(1); this.indices.push(4); this.indices.push(5);
    }
}