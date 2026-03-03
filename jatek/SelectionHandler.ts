class SelectionHandler {

	//private selectionLayer: LayerSelection;
	private allowTouch: boolean;
	private game: GameController;
	public SelectedCell: GameCell | undefined = undefined;
	constructor(game:GameController) {
		//this.selectionLayer = game.layerSelection;
		this.game = game;
		this.allowTouch = true;
		this.bindKeyboard();
	}

	public Reset = () => {
		this.allowTouch = true;
		this.SelectedCell = undefined;
	}

	private bindKeyboard = (): void => {
		
	}
	
	public SelectCell(cell: GameCell|undefined): void {
		this.game.layerSelection.clear();
		if (this.SelectedCell != undefined) {
			if (this.SelectedCell.Unit != undefined &&
				this.SelectedCell.Unit.CanMoveTo(cell!) &&
				this.SelectedCell.Unit.IsHooman) {
				let cellTarget:GameCell = cell!;
				let cellCurrent:GameCell = this.SelectedCell;
				cellCurrent.Unit!.TurnMovementLeft -= cellCurrent.DistanceTo(cellTarget);
				this.game.layerUnit.MoveUnit(cellCurrent.Unit!, cellTarget)

				cellTarget.Unit! = cellCurrent.Unit!;
				cellTarget.Unit!.Cell = cellTarget;
				cellCurrent.Unit = undefined;
				this.game.layerTerrain.clear();
				this.game.layerTerrain.draw();
					
				
				//
				if (cellTarget.Unit!.TurnMovementLeft == 0 && !cellTarget.Unit!.CanAttack)
				{
					cell = undefined;
				}
			}
			else if(this.SelectedCell.Unit != undefined &&
				this.SelectedCell.Unit.CanAttackTo(cell!) &&
				this.SelectedCell.Unit.IsHooman)
			{
				let cellTarget = cell;
				let cellCurrent = this.SelectedCell;
				let hoomanDmg = this.calcDamage(cellCurrent.Unit!);
        		let aiDmg = this.calcDamage(cellTarget!.Unit!);
				cellTarget!.Unit!.HPLeft -= hoomanDmg;
				cellCurrent.Unit!.HPLeft -= aiDmg;
				cellCurrent.Unit!.CanAttack = false

				if (cellTarget!.Unit!.HPLeft <= 0)
				{
					this.Die(cellTarget!.Unit!)
				}
				else
				{
					this.game.layerUnit.MoveUnit(cellTarget!.Unit!, cellTarget!)
				}
				if (cellCurrent!.Unit!.HPLeft <= 0)
				{
					this.Die(cellCurrent!.Unit!)
				}
				else
				{
					this.game.layerUnit.MoveUnit(cellCurrent.Unit!, cellCurrent)
				}

				cell = undefined;
			}
			else if (this.SelectedCell.Row == cell!.Row && this.SelectedCell.Col == cell!.Col) {
				cell = undefined;
			}

			
		}

		this.SelectedCell = cell;
		if (this.SelectedCell != undefined) {
			this.game.layerSelection.DrawSelection(this.SelectedCell);
		}


	}

	public Die(unit: GameUnit)
	{
		this.game.layerUnit.ClearUnit(unit);
		let source: GameUnit[] = this.game.PlayerUnits;
		if (!unit.IsHooman)
		{
			source = this.game.AIUnits;
		}

		source.splice(this.game.PlayerUnits.indexOf(unit),1)
		unit.Cell!.Unit = undefined;
		unit.Cell = undefined;
	}
	private calcDamage(unit:GameUnit):number
	{
		let modifierHpleft = (((unit!.HPLeft / unit!.HP) / 2) + 0.5);
		let modifierRandom = ((Math.random() / 2) - 0.25) + 1;
		let damage = unit!.AP * modifierHpleft * modifierRandom;
		return damage;
	}
	public Redraw(): void {
		this.game.layerSelection.clear();
		if (this.SelectedCell != undefined) {
			this.game.layerSelection.DrawSelection(this.SelectedCell);
		}
	}


	private bind = (element: HTMLElement): void => {
	}
}
