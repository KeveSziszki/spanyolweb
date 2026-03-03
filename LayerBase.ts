abstract class LayerBase
{
	protected canvasElem: HTMLCanvasElement;
	public ctx: CanvasRenderingContext2D;
	protected game: GameController;
	constructor(canvasId: string, game: GameController)
	{
		this.game = game;
		this.canvasElem = <HTMLCanvasElement>document.getElementById(canvasId);
		this.canvasElem.width = game.Container.clientWidth;
		this.canvasElem.height = game.Container.clientHeight;
		this.ctx = this.canvasElem.getContext("2d");
		this.clear();
	}
	public clear():void
	{
		
		this.ctx.resetTransform();
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		this.ctx.setTransform(this.game.Scale, 0, 0, this.game.Scale, -this.game.Window.left * this.game.Scale, -this.game.Window.top * this.game.Scale);
	}
	public abstract draw(): void;
}
