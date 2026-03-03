class LayerBG extends LayerBase {
	private hiddenCanvas: HTMLCanvasElement;
	private image: HTMLImageElement;
	constructor(canvasId: string,imageUrl:string, game: GameController) {
		super(canvasId, game);
		this.hiddenCanvas = document.createElement("canvas");
		this.image = new Image();
		this.image.onload = (ev: Event) => {
			this.draw();
		}
		this.image.src = imageUrl;
	}
	public draw():void
	{

		this.ctx.drawImage(this.image, 0, 0, this.game.BoardWidth, this.game.BoardHeight);
			
	}
	
}


