class Utility {

    private static _proxies: Record<string, object> = {};
    public static NamesProxy<T>(key: string) {
        if (this._proxies[key] == undefined) {
            this._proxies[key] = new Proxy(
                {},
                {
                    get: function (_target, prop, _receiver) {
                        return prop;
                    },
                }
            );

        }
        return this._proxies[key] as {
            [P in keyof T]: P;
        };
    }
    public static BindButtonClick(button: HTMLButtonElement, handler: () => any) {
        button.addEventListener("click", (event: TouchEvent) => {
            event.preventDefault();
            button.classList.add('clicked');
            window.setTimeout(() => {
                button.classList.remove('clicked');
                window.setTimeout(handler, 50);
            }, 50);
        });
    }

    public static Clamp(val: number, min: number, max: number): number {
        return Math.min(Math.max(val, min), max);
    }

    public static getRandomInt = (max: number) => {
        return Math.floor(Math.random() * (max + 1));
    };
    public static PixelDistance(x1:number, y1:number, x2:number, y2:number):number {
        let diffX = (x1 - x2);
		let diffY = (y1 - y2)
		return Math.sqrt(diffX * diffX + diffY * diffY);
    }

    public static enumerateNeighbors(cellCenter: GameCell, range: number, level: number, game: GameController, callback: (cell: GameCell,level: number)=> any, drawn: Set<number> | undefined = undefined) {
        let directionOdd: Pont[] = [{ x: -1, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }, { x: -1, y: 1 }];
		let directionEven: Pont[] = [{ x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }];
		let aroundCells: GameCell[] = [];
        //
        drawn = drawn || new Set<number>();
		for (var d = 0; d < directionEven.length; d++) {
			let dirs = directionOdd;
			if (cellCenter.Col % 2 == 0)
				dirs = directionEven;
			let cPos = new Pont(Utility.Clamp(cellCenter.Col + dirs[d].x, 0, game.Cols - 1),
				Utility.Clamp(cellCenter.Row + dirs[d].y, 0, game.Rows - 1));
			let cellAround = game.Cells[cPos.y][cPos.x];
			aroundCells.push(cellAround);
			if (!(cPos.x == cellCenter.Col && cPos.y == cellCenter.Row)
                && !drawn.has(cellAround.Index))
            {
                drawn.add(cellAround.Index);
                callback(cellAround,level);
			}
		}
		if (level < range)
		{
            for (var i = 0; i < aroundCells.length; i++) {
                this.enumerateNeighbors(aroundCells[i], range, level + 1, game, callback, drawn);
            }
			
		}
	}
}
