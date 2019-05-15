class Polygon
{
    constructor(paWorld, pbWorld, pcWorld, paScreen, pbScreen, pcScreen, paColor, pbColor, pcColor, paUV, pbUV, pcUV, normal, texture)
    {
        this.paWorld = paWorld;
        this.pbWorld = pbWorld;
        this.pcWorld = pcWorld;
        this.paScreen = paScreen;
        this.pbScreen = pbScreen;
        this.pcScreen = pcScreen;
        this.paColor = paColor;
        this.pbColor = pbColor;
        this.pcColor = pcColor;
        this.paUV = paUV;
        this.pbUV = pbUV;
        this.pcUV = pcUV;
        this.normal = normal;
        this.texture = texture;

        this.zAvg = (paWorld.z + pbWorld.z + pcWorld.z) * 0.3333;
    }
}