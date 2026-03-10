
class LayerUnit extends LayerBase {
    private imageLoader:ImageLoader
    constructor(canvasId: string, game: GameController) {
        super(canvasId, game);
        this.game = game;
        this.ctx = this.canvasElem.getContext("2d", { alpha: false });
        this.imageLoader = new ImageLoader();
    }
    public clear(): void {
        super.clear();
        


    }
    public draw(): void {
        let offset = new Pont(this.game.Window.left, this.game.Window.top);
        for (let row = 0; row < this.game.Rows; row++) {
            for (let col = 0; col < this.game.Cols; col++) {
                let cell = this.game.Cells[row][col];
                if (cell.Unit != undefined) {
                    let imageKey = cell.Unit.Type + (cell.Unit.IsHooman?"":"_ai");
                    this.imageLoader.Add({ Col: col, Row: row, ImageKey: imageKey },"img/" + imageKey + ".png");
                }
            }
        }
        this.imageLoader.SubscribeAllLoaded(() => {
            this.imageLoader.Items.forEach((item: ImageLoaderItem) => {
                let cell = this.game.Cells[item.Row][item.Col];
                this.drawUnitAt(this.ctx, cell.Unit, cell.Center);
            });
            this.imageLoader.ClearItems();
		});
    }
    public MoveUnit(unit: GameUnit, targetCell: GameCell): void
    {
        this.clearUnitInternal(this.ctx, unit);
        this.drawUnitAt(this.ctx, unit, new Pont(targetCell.Center.x, targetCell.Center.y));
    }
    public AttackWithUnit(unit: GameUnit,targetCell: GameCell, targetUnit:GameUnit)
    {


    }
    public ClearUnit(unit:GameUnit)
    {
        this.clearUnitInternal(this.ctx,unit);
    }
    private clearUnitInternal(ctx: CanvasRenderingContext2D, unit: GameUnit)
    {
        ctx.globalCompositeOperation = 'destination-out';
        this.game.GridMan.DrawGameCell(ctx, unit.Cell, new Pont(this.game.Window.left, this.game.Window.top), this.game.Scale, undefined, "white");
        ctx.globalCompositeOperation = 'source-over';
        this.ctx.setTransform(this.game.Scale, 0, 0, this.game.Scale, -this.game.Window.left * this.game.Scale, -this.game.Window.top * this.game.Scale);
        
    }
    private clearUnitAt(ctx: CanvasRenderingContext2D, unit: GameUnit, point: Pont) {
        let size = this.game.GridMan.RADIUS * 2;
        ctx.clearRect(point.x - size / 2, point.y - size / 2, size, size);
    }
    public DrawUnitPublic(unit: GameUnit,cell: GameCell)
    {
        this.drawUnitAt(this.ctx, unit, new Pont(cell.Center.x, cell.Center.y));
    }
    private drawUnitAt(ctx: CanvasRenderingContext2D, unit: GameUnit, point: Pont) {
        let size = this.game.GridMan.RADIUS * 1.5;
        let imageKey = unit.Type + (unit.IsHooman?"":"_ai");
        let img = this.imageLoader.ImageCache[imageKey];

        
        ctx.drawImage(img, 0, 0, img.width, img.height,
            point.x - size / 2, point.y - size / 2,
            size, size);
        

        if (unit.IsHooman) {
            ctx.beginPath();
            ctx.fillStyle = "green";
            if (unit.TurnMovementLeft == 0) {
                ctx.fillStyle = "silver";
            }
            ctx.arc(point.x - this.game.GridMan.EDGE_LEN / 2 + 2, point.y - this.game.GridMan.RADIUS + 6, 2, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = "red";
            if (!unit.CanAttack) {
                ctx.fillStyle = "silver";
            }
            ctx.arc(point.x + this.game.GridMan.EDGE_LEN / 2 - 2, point.y - this.game.GridMan.RADIUS + 6, 2, 0, 2 * Math.PI);
            ctx.fill();
        }
        let hpPercent = unit.HPLeft / unit.HP;
        let hpcolor = "green";
        if (hpPercent < 1)
            hpcolor = "yellowgreen";
        if (hpPercent < .8)
            hpcolor = "yellow";
        if (hpPercent < .5)
            hpcolor = "orange";
        if (hpPercent < .3)
            hpcolor = "red";

        let xpPercent = unit.XP / 10
        let y = point.y + this.game.GridMan.RADIUS - 5;
        let x = point.x - this.game.GridMan.EDGE_LEN / 2;
        let len = this.game.GridMan.EDGE_LEN * hpPercent;
        let lenXP = (this.game.GridMan.EDGE_LEN - 4)* xpPercent
                ctx.beginPath();
        ctx.strokeStyle = "#00000088";
        ctx.lineWidth = 3;
        ctx.moveTo(x, y);
        ctx.lineTo(x+this.game.GridMan.EDGE_LEN, y);
        ctx.stroke(); 
        ctx.beginPath();
        ctx.strokeStyle = hpcolor;
        ctx.lineWidth = 2;
        ctx.moveTo(x, y);
        ctx.lineTo(x+len, y);
        ctx.stroke(); 
        ctx.beginPath();
        if (unit.IsHooman)
        {
        ctx.strokeStyle = "#00000088";
        ctx.lineWidth = 3;
        ctx.moveTo(x + 1, y - 4);
        ctx.lineTo(x + (this.game.GridMan.EDGE_LEN - 1), y - 4);
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = "#ffdd44ff";
        ctx.lineWidth = 2;
        ctx.moveTo(x + 2, y - 4);
        ctx.lineTo(x + 2 + lenXP, y- 4);
        ctx.stroke(); 
        }


    }

}	
	
