class LayerBG extends LayerBase {
    constructor(canvasId, imageUrl, game) {
        super(canvasId, game);
        this.hiddenCanvas = document.createElement("canvas");
        this.image = new Image();
        this.image.onload = (ev) => {
            this.draw();
        };
        this.image.src = imageUrl;
    }
    draw() {
        this.ctx.drawImage(this.image, 0, 0, this.game.BoardWidth, this.game.BoardHeight);
    }
}
