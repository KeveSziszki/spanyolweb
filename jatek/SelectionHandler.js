class SelectionHandler {
    constructor(game) {
        this.SelectedCell = undefined;
        this.Reset = () => {
            this.allowTouch = true;
            this.SelectedCell = undefined;
        };
        this.bindKeyboard = () => {
        };
        this.bind = (element) => {
        };
        //this.selectionLayer = game.layerSelection;
        this.game = game;
        this.allowTouch = true;
        this.bindKeyboard();
    }
    SelectCell(cell) {
        this.game.layerSelection.clear();
        let purchase = document.getElementById("purchase");
        if (this.SelectedCell != undefined) {
            purchase.style.visibility = "hidden";
            if (this.SelectedCell.Unit != undefined &&
                this.SelectedCell.Unit.CanMoveTo(cell) &&
                this.SelectedCell.Unit.IsHooman) {
                let cellTarget = cell;
                let cellCurrent = this.SelectedCell;
                cellCurrent.Unit.TurnMovementLeft -= cellCurrent.DistanceTo(cellTarget);
                this.game.layerUnit.MoveUnit(cellCurrent.Unit, cellTarget);
                cellTarget.Unit = cellCurrent.Unit;
                cellTarget.Unit.Cell = cellTarget;
                cellCurrent.Unit = undefined;
                this.game.layerTerrain.clear();
                this.game.layerTerrain.draw();
                //
                if (cellTarget.Unit.TurnMovementLeft == 0 && !cellTarget.Unit.CanAttack) {
                    cell = undefined;
                }
            }
            else if (this.SelectedCell.Unit != undefined &&
                this.SelectedCell.Unit.CanAttackTo(cell) &&
                this.SelectedCell.Unit.IsHooman) {
                let levelUp = false;
                let cellTarget = cell;
                let cellCurrent = this.SelectedCell;
                let hoomanDmg = this.calcDamage(cellCurrent.Unit);
                let aiDmg = this.calcDamage(cellTarget.Unit);
                cellTarget.Unit.HPLeft -= hoomanDmg;
                cellCurrent.Unit.HPLeft -= aiDmg;
                cellCurrent.Unit.CanAttack = false;
                cellCurrent.Unit.XP += 3;
                if (cellTarget.Unit.HPLeft <= 0) {
                    cellCurrent.Unit.XP += 3;
                    this.Die(cellTarget.Unit);
                    this.game.Money += 35;
                    this.game.MoneyRedraw();
                }
                else {
                    this.game.layerUnit.MoveUnit(cellTarget.Unit, cellTarget);
                }
                if (cellCurrent.Unit.XP >= 10) {
                    levelUp = true;
                }
                if (levelUp == true) {
                    if (cellCurrent.Unit.HPLeft <= 0) {
                        cellCurrent.Unit.HPLeft = cellCurrent.Unit.HP / 4;
                    }
                    else {
                        cellCurrent.Unit.HPLeft += cellCurrent.Unit.HP / 2;
                        cellCurrent.Unit.HPLeft = Utility.Clamp(cellCurrent.Unit.HPLeft, 0, cellCurrent.Unit.HP);
                    }
                    if (cellCurrent.Unit.Level <= 3) {
                        cellCurrent.Unit.AP++;
                    }
                    cellCurrent.Unit.XP -= 10;
                    cellCurrent.Unit.Level++;
                }
                if (cellCurrent.Unit.HPLeft <= 0 && levelUp == false) {
                    this.Die(cellCurrent.Unit);
                }
                else {
                    this.game.layerUnit.MoveUnit(cellCurrent.Unit, cellCurrent);
                }
                cell = undefined;
            }
            else if (this.SelectedCell.Row == cell.Row && this.SelectedCell.Col == cell.Col) {
                cell = undefined;
            }
        }
        if (cell != undefined && cell.Type == TerrainType.ConqueredCity && cell.Unit == undefined) {
            purchase.style.visibility = "visible";
        }
        this.SelectedCell = cell;
        if (this.SelectedCell != undefined) {
            this.game.layerSelection.DrawSelection(this.SelectedCell);
        }
    }
    Die(unit) {
        this.game.layerUnit.ClearUnit(unit);
        let source = this.game.PlayerUnits;
        if (!unit.IsHooman) {
            source = this.game.AIUnits;
        }
        source.splice(this.game.PlayerUnits.indexOf(unit), 1);
        unit.Cell.Unit = undefined;
        unit.Cell = undefined;
    }
    calcDamage(unit) {
        let modifierHpleft = (((unit.HPLeft / unit.HP) / 2) + 0.5);
        let modifierRandom = ((Math.random() / 2) - 0.25) + 1;
        let damage = unit.AP * modifierHpleft * modifierRandom;
        return damage;
    }
    Redraw() {
        this.game.layerSelection.clear();
        if (this.SelectedCell != undefined) {
            this.game.layerSelection.DrawSelection(this.SelectedCell);
        }
    }
}
