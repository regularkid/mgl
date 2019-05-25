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
            this.width = this.image.width;
            this.height = this.image.height;

            this.cachePixelColors();
        }
    }

    cachePixelColors()
    {
        this.pixelsRGB = new Array(this.width * this.height);
        for (let y = 0; y < this.height; y++)
        {
            for (let x = 0; x < this.width; x++)
            {
                let color = this.context.getImageData(x, y, 1, 1).data;
                let r = color[0];
                let g = color[1];
                let b = color[2];

                // Convert to 32-bit ABGR format (colors will be flipped on any browser that isn't)
                let colorRGB = new Color(r / 255.0, g / 255.0, b / 255.0);
                this.pixelsRGB[(y * this.width) + x] = colorRGB;
            }
        }
    }

    GetPixelRGB(uv)
    {
        let x = Math.round((this.width - 1)*uv.x);
        let y = Math.round((this.height - 1)*uv.y);

        // TODO: Support UVs >1 or <0
        if (this.pixelsRGB === undefined || x < 0 || y < 0 || x >= this.width || y >= this.height)
        {
            return new Color(1.0, 0.0, 1.0);
        }

        return this.pixelsRGB[(y * this.width) + x];
    }
}