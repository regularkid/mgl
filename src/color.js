class Color
{
    constructor(r, g, b)
    {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    Get32Bit()
    {
        let r = Math.floor(Math.max(0.0, Math.min(1.0, this.r)) * 255.0);
        let g = Math.floor(Math.max(0.0, Math.min(1.0, this.g)) * 255.0);
        let b = Math.floor(Math.max(0.0, Math.min(1.0, this.b)) * 255.0);

        return (r & 0x000000FF) |
               ((g << 8) & 0x0000FF00) |
               ((b << 16) & 0x00FF0000) |
               0xFF000000;
    }
}