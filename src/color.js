class Color
{
    constructor(r, g, b)
    {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    Get32BitMultiplied(x)
    {
        let r = Math.floor(this.r * x);
        let g = Math.floor(this.g * x);
        let b = Math.floor(this.b * x);

        return (r & 0x000000FF) |
               ((g << 8) & 0x0000FF00) |
               ((b << 16) & 0x00FF0000) |
               0xFF000000;
    }
}