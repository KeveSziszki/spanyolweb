
class LayerGrid extends LayerBase {

    constructor(canvasId: string, game: GameController) {
        super(canvasId, game);
        this.game = game;
        this.ctx = this.canvasElem.getContext("2d", { alpha: false });

    }
    public clear(): void {
        super.clear();
    }
    public draw(): void {
        let offset = new Pont(this.game.Window.left, this.game.Window.top);
        for (let row = 0; row < this.game.Rows; row++) {
            for (let col = 0; col < this.game.Cols; col++) {
                this.game.GridMan.DrawGameCell(this.ctx, this.game.Cells[row][col], offset, this.game.Scale);
            }
        }
    }
}	
	
