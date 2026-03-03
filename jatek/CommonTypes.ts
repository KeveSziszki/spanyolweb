class Color {
    public static Default: string = "default";
    public readonly R: number = 0;
    public readonly G: number = 0;
    public readonly B: number = 0;
    public A: number = 255;
    constructor(r: number | string, g?: number, b?: number, a: number = 255)
    {
        if (typeof (r) === "string")
        {
            let tmp = Color.fromHex(r);
            this.R = tmp.R;
            this.G = tmp.G;
            this.B = tmp.B;
            this.A = tmp.A;
        }
        else {
            this.R = r;
            this.G = g;
            this.B = b;
            this.A = a;
        }
    }
    public get IsDefault(): boolean { return (this.R==1 && this.G==1 && this.B==1 && this.A == 1) }
    public static fromImageData(pixel: Uint8ClampedArray, index: number):Color {
        return new Color(pixel[index * 4], pixel[index * 4 + 1], pixel[index * 4 + 2], pixel[index * 4 + 3]);
    }
    public static fromHex(hex: string): Color {
        if (hex == undefined)
            return undefined;
        let r: number = 1;
        let g: number = 1;
        let b: number = 1;
        let a: number = 1;
        if (hex != Color.Default) {
            r = parseInt(hex.substring(1, 3), 16);
            g = parseInt(hex.substring(3, 5), 16);
            b = parseInt(hex.substring(5, 7), 16);
            if (hex.length > 7)
                a = parseInt(hex.substring(7, 9), 16);
            else
                a = 255;
        }
        return new Color(r, g, b, a);
    }
    public static ToHexString = (color: Color): string =>
    {
        return `#${color.R.toString(16).padStart(2, '0')}${color.G.toString(16).padStart(2, '0')}${color.B.toString(16).padStart(2, '0')}${color.A.toString(16).padStart(2, '0')}`;
    }
    
}
class Pont
{
    public x: number;
    public y: number;
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
}

//note flags
enum TerrainMovementModifier {
    None = 0,
    Normal = 1,
    Hard = .5,
}
enum TerrainType {
    Sea = 0,
    Ground = 1,
    Swamp = 2,
    River = 3,
    Mountain = 4,
    City = 5,
}

class Rect {
    public top: number = 0;
    public left: number = 0;
    public width: number = 0;
    public height: number = 0;
    constructor(left: number, top: number, width: number, height: number) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
}
class GameCell
{
    public readonly Row: number;
    public readonly Col: number;
    public readonly IsFirstRow: boolean;
    public readonly IsFirstCol: boolean;
    public readonly IsLastRow: boolean;
    public readonly IsOdd: boolean;
    public readonly Center: Pont;
    public Unit?: GameUnit;
    public readonly MovementModifier: TerrainMovementModifier;
    public Type: TerrainType;
    public readonly Index: number;
    public Spotted: boolean = false;
    public Tempdistance?: number = undefined;
    constructor(row: number, col: number, index:number, center: Pont, isLastRow: boolean, type: TerrainType = TerrainType.Ground) {
        this.Row = row;
        this.Col = col;
        this.IsFirstRow = row == 0;
        this.IsFirstCol = col == 0;
        this.IsLastRow = isLastRow;
        this.IsOdd = row % 2 == 0;
        this.Center = center;
        this.Type = type;
        this.Index = index;
        this.MovementModifier = TerrainMovementModifier.Normal
    }
    public DistanceTo(to: GameCell): number {
        let thiscell = this.offset_to_axial(this);
        let tocell = this.offset_to_axial(to);
        return this.axial_distance(thiscell, tocell);
    }
    private offset_to_axial(hex:GameCell)
    {
        let parity = hex.Col&1;
        let q = hex.Col;
        let r = hex.Row - (hex.Col - parity) / 2;
        return new Pont(q, r);
    }
    private axial_distance(a:Pont, b:Pont)
    {
        return (Math.abs(a.x - b.x)
          + Math.abs(a.x + a.y - b.x - b.y)
          + Math.abs(a.y - b.y)) / 2;
    }
}
enum UnitType {
    Foot = "foot",
    Cavalry = "cavalry",
    Siege = "siege"
}
class GameUnit {
    public Type: UnitType;
    public Cell: GameCell | undefined;
    public HP: number;
    public AP: number;
    public Range: number = 1;
    public Movement: number = 1;
    public TurnMovementLeft: number;
    public CanAttack: boolean;
    public HPLeft: number;
    public IsHooman: boolean;
    constructor(type: UnitType, hp: number, ap: number, range: number = 1, movement: number = 1, isHooman: boolean){
        this.AP = ap;
        this.HP = hp;
        this.Type = type;
        this.Range = range;
        this.Movement = movement;
        this.TurnMovementLeft = movement;
        this.CanAttack = true;
        this.HPLeft = hp;
        this.IsHooman = isHooman;
    }
    public CanMoveTo(target: GameCell): boolean {

        let distance: number = this.Cell.DistanceTo(target);
        return distance <= this.TurnMovementLeft &&
                target.Unit == undefined;
    }
    public CanAttackTo(target: GameCell): boolean {
        let distance: number = this.Cell.DistanceTo(target);
        return distance <= this.Range &&
            target.Unit != undefined &&
            target.Unit.IsHooman != this.IsHooman;
    }
}

//cache képekhez aszinkron betöltés
class ImageLoader {
    private callback: () => void;
    public SubscribeAllLoaded(callback: () => void) {
        this.callback = callback;
        this.checkCallBack();
    }
    private checkCallBack(): void {
        if (this.loadingCount == 0 && this.callback != undefined)
        {
            this.callback();
        }
    }
    public Items: ImageLoaderItem[] = [];
    public ImageCache: Record<string, HTMLImageElement> = {};
    private loadingCount: number = 0;
    public ClearItems(): void {
        this.Items = [];
    }
    public Add(item: ImageLoaderItem, imageSource:string): void
    {
        this.Items.push(item);
        if (this.ImageCache[item.ImageKey] == undefined)
        {
            this.loadingCount++;
            let img = new Image();
            this.ImageCache[item.ImageKey] = img;
            img.onload = () => {
                this.loadingCount--;
                this.checkCallBack();
            };
            img.src = imageSource;
        }
    }

}
class ImageLoaderItem {
    public Row: number;
    public Col: number;
    public ImageKey: string;
}




