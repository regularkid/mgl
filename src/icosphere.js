class Icosphere
{
    constructor(center, radius, numSubdivisions, texture)
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

        for (let i = 0; i < numSubdivisions; i++)
        {
            this.Subdivide();
        }

        // I don't know how to texture icosphere yet - just assume solid color texture for now
        this.uvs = [];
        for (let i = 0; i < this.verts.length; i++)
        {
            this.uvs.push(new Vec3(0.0, 0.0));
        }

        this.texture = texture;

        this.tm = new Matrix4x4(new Vec3(radius, 0, 0),
                                new Vec3(0, radius, 0),
                                new Vec3(0, 0, radius),
                                center);
    }

    Subdivide()
    {
        // This algo dupes verts - I'm ok with that to keep it super simple
        let newVerts = [];
        let newIndices = [];
        for (let i = 0; i < this.indices.length; i += 3)
        {
            let a = this.verts[this.indices[i]];        // newVerts.length
            let b = this.verts[this.indices[i + 1]];    // newVerts.length + 1
            let c = this.verts[this.indices[i + 2]];    // newVerts.length + 2
            let ab = a.Add(b).Scale(0.5);               // newVerts.length + 3
            let bc = b.Add(c).Scale(0.5);               // newVerts.length + 4
            let ca = c.Add(a).Scale(0.5);               // newVerts.length + 5

            newIndices.push(newVerts.length); newIndices.push(newVerts.length + 3); newIndices.push(newVerts.length + 5);
            newIndices.push(newVerts.length + 3); newIndices.push(newVerts.length + 1); newIndices.push(newVerts.length + 4);
            newIndices.push(newVerts.length + 5); newIndices.push(newVerts.length + 4); newIndices.push(newVerts.length + 2);
            newIndices.push(newVerts.length + 3); newIndices.push(newVerts.length + 4); newIndices.push(newVerts.length + 5);

            newVerts.push(a.Normalize());
            newVerts.push(b.Normalize());
            newVerts.push(c.Normalize());
            newVerts.push(ab.Normalize());
            newVerts.push(bc.Normalize());
            newVerts.push(ca.Normalize());
        }

        this.verts = newVerts;
        this.indices = newIndices;
    }
}