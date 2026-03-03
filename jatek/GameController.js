class GameController {
    constructor() {
        this.Scale = 1;
        this.CurrentTurn = 0;
        this.maxTurn = 15;
        this.remCities = 0;
        this.allowInput = true;
        this.start = () => {
            this.Cells = [];
            this.PlayerUnits = [];
            this.AIUnits = [];
            //cellacsinálás
            for (var row = 0; row < this.Rows; row++) {
                let currentRow = [];
                for (var col = 0; col < this.Cols; col++) {
                    let center = this.GridMan.GridToCenter(col, row);
                    currentRow.push(new GameCell(row, col, row * this.Cols + col, center, row == (this.Rows - 1)));
                }
                this.Cells.push(currentRow);
            }
            //városok megtalálása
            for (var i = 0; i < this.cities.length; i++) {
                this.Cells[this.cities[i].y][this.cities[i].x].Type = TerrainType.City;
            }
            //lovasság
            for (var i = 0; i < 5; i++) {
                this.PlayerUnits.push(new GameUnit(UnitType.Cavalry, 12, 5, 1, 2, true));
                this.AIUnits.push(new GameUnit(UnitType.Cavalry, 12, 5, 1, 2, false));
            }
            //gyalogság
            for (var i = 0; i < 14; i++) {
                this.PlayerUnits.push(new GameUnit(UnitType.Foot, 10, 4, 1, 1, true));
                this.AIUnits.push(new GameUnit(UnitType.Foot, 10, 4, 1, 1, false));
            }
            //extra
            this.AIUnits.push(new GameUnit(UnitType.Foot, 10, 4, 1, 1, false));
            this.PlayerUnits.push(new GameUnit(UnitType.Siege, 5, 15, 1, 1, true));
            //pozició randomozilása player seregnek
            this.randomizeUnits(1, 3, 4, this.Cols - 4, this.PlayerUnits);
            // városokba ellenség
            let footIndex = 5;
            for (var i = 0; i < this.cities.length; i++) {
                let cellCity = this.Cells[this.cities[i].y][this.cities[i].x];
                let foot = this.AIUnits[footIndex++];
                foot.Cell = cellCity;
                cellCity.Unit = foot;
            }
            // ai sereg randomizálása
            this.randomizeUnits(6, this.Rows - 5, 4, this.Cols - 5, this.AIUnits);
            let song = new Audio;
            song.src = "Spainishdrama.mp3";
            song.loop = true;
            song.play();
            song.volume = 0;
            this.input.AllowInput = true;
            this.selectionHandler.Reset();
            this.NextTurn();
            this.Redraw();
        };
        this.Container = document.getElementById("gamePage");
        this.Window = new Rect(0, 0, this.Container.clientWidth, this.Container.clientHeight);
        this.GridMan = new GridManager(25);
        this.Cells = [];
        this.Rows = 20;
        this.Cols = 20;
        this.BoardHeight = (this.Rows + 1) * this.GridMan.GRID_Y_SPACE + this.GridMan.GRID_Y_OFFSET;
        this.BoardWidth = (this.Cols + 1) * this.GridMan.GRID_X_SPACE + this.GridMan.GRID_X_SPACE / 2;
        this.layerBG = new LayerBG("canvas_bg", "img/spain.png", this);
        this.layerTerrain = new LayerTerrain("canvas_terrain", this);
        this.layerGrid = new LayerGrid("canvas_grid", this);
        this.layerSelection = new LayerSelection("canvas_selection", this);
        this.layerUnit = new LayerUnit("canvas_unit", this);
        this.selectionHandler = new SelectionHandler(this);
        this.input = new InputHandler(this);
        this.cities = [{ x: 2, y: 2 }, { x: 9, y: 5 }, { x: 16, y: 5 }, { x: 10, y: 8 }, { x: 11, y: 8 }, { x: 10, y: 9 }, { x: 7, y: 15 }, { x: 15, y: 14 }];
        this.remCities = this.cities.length;
    }
    //numberek padding
    randomizeUnits(lineFrom, lineTo, padLeft, padRight, units) {
        let from = lineFrom * this.Cols;
        let to = (lineTo + 1) * this.Cols;
        let slots = [];
        //lehetséges helyek keresése
        for (var i = 0; i < to - from; i++) {
            let col = (from + i) % this.Cols;
            let row = Math.floor((from + i) / this.Cols);
            let cell = this.Cells[row][col];
            if (col > padLeft && col < padRight && cell.Type == TerrainType.Ground) {
                slots.push(from + i);
            }
        }
        //randomizálás 
        for (var i = 0; i < units.length; i++) {
            if (units[i].Cell == undefined) {
                let rndIndex = Utility.getRandomInt(slots.length - 1);
                let pos = slots[rndIndex];
                slots.splice(rndIndex, 1);
                units[i].Cell = this.Cells[Math.floor(pos / this.Cols)][pos % this.Cols];
                units[i].Cell.Unit = units[i];
            }
        }
    }
    //törlés és kirajzolás
    Redraw() {
        this.layerGrid.clear();
        this.layerTerrain.clear();
        this.layerBG.clear();
        this.layerUnit.clear();
        this.layerBG.draw();
        this.layerGrid.draw();
        this.layerTerrain.draw();
        this.selectionHandler.Redraw();
        this.layerUnit.draw();
    }
    NextTurn() {
        this.CurrentTurn++;
        if (this.CurrentTurn <= this.maxTurn) {
            this.PlayerUnits.forEach((u) => {
                u.CanAttack = true;
                u.TurnMovementLeft = u.Movement;
            });
            this.AIUnits.forEach((u) => {
                u.CanAttack = true;
                u.TurnMovementLeft = u.Movement;
            });
            document.getElementById("turns").textContent = `Turn ${this.CurrentTurn}/${this.maxTurn}`;
            this.cities.forEach((c) => {
                var _a;
                if (this.Cells[c.y][c.x].Type == TerrainType.City && this.Cells[c.y][c.x].Unit != undefined && ((_a = this.Cells[c.y][c.x].Unit) === null || _a === void 0 ? void 0 : _a.IsHooman)) {
                    this.Cells[c.y][c.x].Type = TerrainType.ConqueredCity;
                    this.remCities--;
                }
            });
            document.getElementById("cities").textContent = `Cities Remaining: ${this.remCities}`;
            this.selectionHandler.Reset();
            this.Redraw();
            if (this.remCities == 0) {
                this.layerUnit.clear();
                this.layerUnit.ctx.font = `${Math.floor(this.layerUnit.ctx.canvas.width / 6)}px ariel`;
                let img = new Image();
                img.onload = (ev) => {
                    this.layerUnit.ctx.drawImage(img, 0, 0);
                };
                img.src = "img/victory.png";
            }
        }
    }
}
