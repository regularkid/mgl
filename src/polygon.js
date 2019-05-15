class Polygon
{
    constructor(pa, pb, pc, paColor, pbColor, pcColor, paUV, pbUV, pcUV, texture)
    {
        this.pa = pa;
        this.pb = pb;
        this.pc = pc;
        this.paColor = paColor;
        this.pbColor = pbColor;
        this.pcColor = pcColor;
        this.paUV = paUV;
        this.pbUV = pbUV;
        this.pcUV = pcUV;
        this.texture = texture;

        this.zAvg = (pa.z + pb.z + pc.z) * 0.3333;
    }
}