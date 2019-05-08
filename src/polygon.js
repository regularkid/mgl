class Polygon
{
    constructor(pa, pb, pc, paColor, pbColor, pcColor)
    {
        this.pa = pa;
        this.pb = pb;
        this.pc = pc;
        this.paColor = paColor;
        this.pbColor = pbColor;
        this.pcColor = pcColor;

        this.zAvg = (pa.z + pb.z + pc.z) * 0.3333;
    }
}