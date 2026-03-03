class GridManager {
    private readonly EDGES:number = 6;
	public readonly RADIUS:number = 20;
    public readonly RADFULL:number = 2 * Math.PI;
    public readonly EDGE_LEN:number = Math.sin(Math.PI / this.EDGES) * this.RADIUS * 2;
	public readonly GRID_Y_SPACE:number = Math.cos(Math.PI / this.EDGES) * this.RADIUS * 2;
	public readonly GRID_X_SPACE:number = this.RADIUS * 2 - this.EDGE_LEN * 0.5;
	public readonly GRID_Y_OFFSET:number = this.GRID_Y_SPACE * 0.5;
    public POLY: Pont[];
    constructor(radius: number) {
        this.RADIUS = radius;
        this.RADFULL = 2 * Math.PI;
        this.EDGE_LEN = Math.sin(Math.PI / this.EDGES) * this.RADIUS * 2;
        this.GRID_Y_SPACE = Math.cos(Math.PI / this.EDGES) * this.RADIUS * 2;
        this.GRID_X_SPACE = this.RADIUS * 2 - this.EDGE_LEN * 0.5;
        this.GRID_Y_OFFSET = this.GRID_Y_SPACE * 0.5;
        this.POLY = this.createPoly();
    }
    private createPoly(): Pont[] {
        let points: Pont[] = [];
        const step = this.RADFULL / this.EDGES;
        var ang = 0, i = this.EDGES;
        while (i--) {
            points.push(new Pont(Math.round(this.RADIUS * Math.cos(ang)), Math.round(this.RADIUS * Math.sin(ang))));
            ang += step;
        }
        return points;
    }
    public GridToCenter(col: number, row: number): Pont {
        let center = new Pont(
            (col + 1) * this.GRID_X_SPACE,
            (row + 1) * this.GRID_Y_SPACE + (col % 2 ? this.GRID_Y_OFFSET : 0));
        return center;
    }
    public DrawGameCell(ctx: CanvasRenderingContext2D, cell: GameCell, offset: Pont, scale:number = 1, strokeStyle: string = "gray", fillStyle: string = undefined): void {
        this.drawPoly(ctx, cell, offset, scale, strokeStyle, fillStyle);
    }
    private drawPoly(ctx: CanvasRenderingContext2D, cell: GameCell, offset: Pont, scale: number,
        strokeStyle?: string, fillStyle?: string): void {
        
        ctx.setTransform(scale, 0, 0, scale, (cell.Center.x - offset.x) * scale, (cell.Center.y - offset.y) * scale);

        let points = this.POLY;

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y)
        ctx.strokeStyle = fillStyle;
        ctx.fillStyle = fillStyle;
        for (var i = 1; i < points.length; i++)
        {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        
        if (fillStyle != undefined)
        {
            ctx.fill();
        }
        if (strokeStyle != undefined) {
            ctx.stroke();
        }
        

    }
    
}
