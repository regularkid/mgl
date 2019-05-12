class Texture
{
    constructor(path)
    {
        this.image = new Image();
        this.image.src = path;
        this.image.crossOrigin = "Anonymous";
        this.image.onload = () =>
        {
            this.canvas = document.createElement('canvas');
            this.context = this.canvas.getContext('2d');
            this.context.drawImage(this.image, 0, 0);

            this.cachePixelColors();
        }
    }

    cachePixelColors()
    {
        this.pixels = new Array(this.image.width * this.image.height);
        for (let y = 0; y < this.image.height; y++)
        {
            for (let x = 0; x < this.image.width; x++)
            {
                let color = this.context.getImageData(x, y, 1, 1).data;
                let r = color[0];
                let g = color[1];
                let b = color[2];
                this.pixels[(y * this.image.width) + x] = 0xFF000000 | ((b << 16) & 0xFFFF0000) | ((g << 8) & 0xFF00FF00) | (r & 0xFF0000FF);
            }
        }
    }

    GetPixel(uv)
    {
        let x = Math.round((this.image.width - 1)*uv.x);
        let y = Math.round((this.image.height - 1)*uv.y);

        if (this.pixels === undefined || x < 0 || y < 0 || x >= this.image.width || y >= this.image.height)
        {
            return 0xFFFF00FF;
        }

        return this.pixels[(y * this.image.width) + x];
    }
}