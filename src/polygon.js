class Polygon
{
    constructor(pa, pb, pc, color)
    {
        this.pa = pa;
        this.pb = pb;
        this.pc = pc;
        this.color = color;

        this.zAvg = (pa.z + pb.z + pc.z) * 0.3333;
    }
}