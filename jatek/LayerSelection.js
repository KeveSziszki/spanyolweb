class LayerSelection extends LayerBase {
    constructor(canvasId, game) {
        super(canvasId, game);
        this.clear = () => {
            super.clear();
        };
    }
    get Canvas() {
        return this.canvasElem;
    }
    draw() {
        //nope
    }
    DrawSelection(cell) {
        let offset = new Pont(this.game.Window.left, this.game.Window.top);
        this.game.GridMan.DrawGameCell(this.ctx, cell, offset, this.game.Scale, undefined, "#32cd32aa");
        if (cell.Unit != undefined && cell.Unit.IsHooman) {
            if (cell.Unit.TurnMovementLeft > 0 || cell.Unit.CanAttack) {
                Utility.enumerateNeighbors(cell, Math.max(cell.Unit.TurnMovementLeft, cell.Unit.Range), 1, this.game, (cellAround, level) => {
                    cellAround.Tempdistance = level;
                    if (cell.Unit.CanAttackTo(cellAround) && level <= cell.Unit.Range) {
                        this.game.GridMan.DrawGameCell(this.ctx, cellAround, offset, this.game.Scale, "#ff0000AA", "#ff000577");
                    }
                    else if (cell.Unit.CanMoveTo(cellAround)) {
                        this.game.GridMan.DrawGameCell(this.ctx, cellAround, offset, this.game.Scale, "#32cd32AA", "#32cd3255");
                    }
                });
            }
        }
    }
}
