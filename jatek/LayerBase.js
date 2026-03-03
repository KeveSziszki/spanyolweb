class LayerBase {
    constructor(canvasId, game) {
        this.game = game;
        this.canvasElem = document.getElementById(canvasId);
        this.canvasElem.width = game.Container.clientWidth;
        this.canvasElem.height = game.Container.clientHeight;
        this.ctx = this.canvasElem.getContext("2d");
        this.clear();
    }
    clear() {
        this.ctx.resetTransform();
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.setTransform(this.game.Scale, 0, 0, this.game.Scale, -this.game.Window.left * this.game.Scale, -this.game.Window.top * this.game.Scale);
    }
}
