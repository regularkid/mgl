class Light
{
    constructor(dir, ambient, diffuse)
    {
        this.dir = dir.Normalize();
        this.ambient = ambient;
        this.diffuse = diffuse;
    }
}