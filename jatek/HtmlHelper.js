class HtmlHelper {
    static NamesProxy(key) {
        if (this._proxies[key] == undefined) {
            this._proxies[key] = new Proxy({}, {
                get: function (_target, prop, _receiver) {
                    return prop;
                },
            });
        }
        return this._proxies[key];
    }
    static BindButtonClick(button, handler) {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            button.classList.add('clicked');
            window.setTimeout(() => {
                button.classList.remove('clicked');
                window.setTimeout(handler, 50);
            }, 50);
        });
    }
    static Clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }
    static PixelDistance(x1, y1, x2, y2) {
        let diffX = (x1 - x2);
        let diffY = (y1 - y2);
        return Math.sqrt(diffX * diffX + diffY * diffY);
    }
    static enumerateNeighbors(cellCenter, range, level, drawn, game, callback) {
        let directionOdd = [{ x: -1, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }, { x: -1, y: 1 }];
        let directionEven = [{ x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }];
        let aroundCels = [];
        for (var d = 0; d < directionEven.length; d++) {
            let dirs = directionOdd;
            if (cellCenter.Col % 2 == 0)
                dirs = directionEven;
            let cPos = new P2(HtmlHelper.Clamp(cellCenter.Col + dirs[d].x, 0, game.Cols - 1), HtmlHelper.Clamp(cellCenter.Row + dirs[d].y, 0, game.Rows - 1));
            let cellAround = game.Cells[cPos.y][cPos.x];
            aroundCels.push(cellAround);
            if (!(cPos.x == cellCenter.Col && cPos.y == cellCenter.Row)
                && !drawn.has(cellAround.Index)) {
                drawn.add(cellAround.Index);
                callback(cellAround);
            }
        }
        if (level < range) {
            for (var i = 0; i < aroundCels.length; i++) {
                this.enumerateNeighbors(aroundCels[i], range, level + 1, drawn, game, callback);
            }
        }
    }
}
HtmlHelper._proxies = {};
HtmlHelper.getRandomInt = (max) => {
    return Math.floor(Math.random() * (max + 1));
};
