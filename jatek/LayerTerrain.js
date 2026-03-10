class LayerTerrain extends LayerBase {
    constructor(canvasId, game) {
        super(canvasId, game);
        this.game = game;
        this.ctx = this.canvasElem.getContext("2d", { alpha: false });
    }
    draw() {
        let offset = new Pont(this.game.Window.left, this.game.Window.top);
        for (let row = 0; row < this.game.Rows; row++) {
            for (let col = 0; col < this.game.Cols; col++) {
                let cell = this.game.Cells[row][col];
                if (cell.Type == TerrainType.City)
                    this.game.GridMan.DrawGameCell(this.ctx, cell, offset, this.game.Scale, "red", "#88888899");
                if (cell.Type == TerrainType.ConqueredCity)
                    this.game.GridMan.DrawGameCell(this.ctx, cell, offset, this.game.Scale, "green", "#88dd8899");
            }
        }
    }
}
