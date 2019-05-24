class Polygon
{
    constructor(paWorld, pbWorld, pcWorld, paScreen, pbScreen, pcScreen, paUV, pbUV, pcUV, normal, texture)
    {
        this.paWorld = paWorld;
        this.pbWorld = pbWorld;
        this.pcWorld = pcWorld;
        this.paScreen = paScreen;
        this.pbScreen = pbScreen;
        this.pcScreen = pcScreen;
        this.paUV = paUV;
        this.pbUV = pbUV;
        this.pcUV = pcUV;
        this.normal = normal;
        this.texture = texture;

        this.zAvg = (paWorld.z + pbWorld.z + pcWorld.z) * 0.3333;
    }
}