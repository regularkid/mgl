class Light
{
    constructor(dir, ambient, diffuse)
    {
        this.dir = dir.Normalize();
        this.dirInv = this.dir.Invert();
        this.ambient = ambient;
        this.diffuse = diffuse;
    }
}