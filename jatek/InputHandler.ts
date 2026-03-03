class InputHandler {
	private game: GameController;
    constructor(game: GameController) {
        this.game = game;
        this.bind();
    }
    private bind(): void {
        document.onkeyup = (ev: KeyboardEvent) => {
			switch (ev.code) {
				case "KeyS":
					{
						this.moveWindow(0, (this.game.GridMan.GRID_Y_OFFSET));
						break;
					}
				case "KeyD":
					{
						this.moveWindow(this.game.GridMan.GRID_X_SPACE, 0);
						break;
					}
				case "KeyW":
					{
						this.moveWindow(0, -(this.game.GridMan.GRID_Y_OFFSET));
						break;
					}
				case "KeyA":
					{
						this.moveWindow(-(this.game.GridMan.GRID_X_SPACE), 0);
						break;
					}
			}
		}
		this.game.Container.onmouseup = (e: MouseEvent) => {
			if (e.button == 0) {
				let tempSelected = this.getCellAtPixel(e.offsetX, e.offsetY);
				if (tempSelected != undefined) {
					this.game.selectionHandler.SelectCell(this.game.Cells[tempSelected.y][tempSelected.x]);
				}
			}
		}
		document.getElementById("btn-next-turn")!.addEventListener("click",(e:MouseEvent) => {
			this.game.NextTurn()
		})
	}

	private moveWindow(diffX: number, diffY: number): void {
		let maxX = this.game.BoardWidth - (this.game.Window.width / this.game.Scale);
		let maxY = this.game.BoardHeight - (this.game.Window.height / this.game.Scale);
		let newX = this.game.Window.left + diffX;
		let newY = this.game.Window.top + diffY;
		newX = Utility.Clamp(newX, 0, maxX);
		newY = Utility.Clamp(newY, 0, maxY);

		this.game.Window.top = newY;
		this.game.Window.left = newX;
		this.game.Redraw();
	}
	private getCellAtPixel(x: number, y: number): Pont {
		x = Math.round((x / this.game.Scale) + this.game.Window.left);
		y = Math.round((y / this.game.Scale) + this.game.Window.top);

		let nearCol = Math.floor(x / this.game.GridMan.GRID_X_SPACE);
		let nearRow = Math.floor(y / this.game.GridMan.GRID_Y_SPACE);
		//three possible columns
		let cols = [];
		if (nearCol > 0  && nearCol - 1 < this.game.Cols)
			cols.push(nearCol - 1);
		if (nearCol < this.game.Cols)
			cols.push(nearCol);
		if (nearCol < this.game.Cols - 1)
			cols.push(nearCol + 1);
		//twoo possible rows
		let rows = [];
		if (nearRow > 0 && nearRow - 1 < this.game.Rows)
			rows.push(nearRow - 1);
		if (nearRow < this.game.Rows)
			rows.push(nearRow);
		let minDistance = Number.MAX_SAFE_INTEGER;
		let closestClicked:Pont;
		for (var r = 0; r < rows.length; r++)
		{
			for (var c = 0; c < cols.length; c++) {
				let center = this.game.GridMan.GridToCenter(cols[c], rows[r]);
				let distance = Utility.PixelDistance(x, y, center.x, center.y);
				if (distance <= this.game.GridMan.RADIUS) {
					closestClicked = new Pont(cols[c], rows[r]);
					return closestClicked;
				}
				else if (distance < minDistance) {
					minDistance = distance;
					closestClicked = new Pont(cols[c], rows[r]);
				}
            }
		}
		return closestClicked;
	}
}