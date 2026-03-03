class Color {
    constructor(r, g, b, a = 255) {
        this.R = 0;
        this.G = 0;
        this.B = 0;
        this.A = 255;
        if (typeof (r) === "string") {
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
    get IsDefault() { return (this.R == 1 && this.G == 1 && this.B == 1 && this.A == 1); }
    static fromImageData(pixel, index) {
        return new Color(pixel[index * 4], pixel[index * 4 + 1], pixel[index * 4 + 2], pixel[index * 4 + 3]);
    }
    static fromHex(hex) {
        if (hex == undefined)
            return undefined;
        let r = 1;
        let g = 1;
        let b = 1;
        let a = 1;
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
}
Color.Default = "default";
Color.ToHexString = (color) => {
    return `#${color.R.toString(16).padStart(2, '0')}${color.G.toString(16).padStart(2, '0')}${color.B.toString(16).padStart(2, '0')}${color.A.toString(16).padStart(2, '0')}`;
};
class Pont {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}
//note flags
var TerrainMovementModifier;
(function (TerrainMovementModifier) {
    TerrainMovementModifier[TerrainMovementModifier["None"] = 0] = "None";
    TerrainMovementModifier[TerrainMovementModifier["Normal"] = 1] = "Normal";
    TerrainMovementModifier[TerrainMovementModifier["Hard"] = 0.5] = "Hard";
})(TerrainMovementModifier || (TerrainMovementModifier = {}));
var TerrainType;
(function (TerrainType) {
    TerrainType[TerrainType["Sea"] = 0] = "Sea";
    TerrainType[TerrainType["Ground"] = 1] = "Ground";
    TerrainType[TerrainType["Swamp"] = 2] = "Swamp";
    TerrainType[TerrainType["River"] = 3] = "River";
    TerrainType[TerrainType["Mountain"] = 4] = "Mountain";
    TerrainType[TerrainType["City"] = 5] = "City";
    TerrainType[TerrainType["ConqueredCity"] = 6] = "ConqueredCity";
})(TerrainType || (TerrainType = {}));
class Rect {
    constructor(left, top, width, height) {
        this.top = 0;
        this.left = 0;
        this.width = 0;
        this.height = 0;
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
}
class GameCell {
    constructor(row, col, index, center, isLastRow, type = TerrainType.Ground) {
        this.Spotted = false;
        this.Tempdistance = undefined;
        this.Row = row;
        this.Col = col;
        this.IsFirstRow = row == 0;
        this.IsFirstCol = col == 0;
        this.IsLastRow = isLastRow;
        this.IsOdd = row % 2 == 0;
        this.Center = center;
        this.Type = type;
        this.Index = index;
        this.MovementModifier = TerrainMovementModifier.Normal;
    }
    DistanceTo(to) {
        let thiscell = this.offset_to_axial(this);
        let tocell = this.offset_to_axial(to);
        return this.axial_distance(thiscell, tocell);
    }
    offset_to_axial(hex) {
        let parity = hex.Col & 1;
        let q = hex.Col;
        let r = hex.Row - (hex.Col - parity) / 2;
        return new Pont(q, r);
    }
    axial_distance(a, b) {
        return (Math.abs(a.x - b.x)
            + Math.abs(a.x + a.y - b.x - b.y)
            + Math.abs(a.y - b.y)) / 2;
    }
}
var UnitType;
(function (UnitType) {
    UnitType["Foot"] = "foot";
    UnitType["Cavalry"] = "cavalry";
    UnitType["Siege"] = "siege";
})(UnitType || (UnitType = {}));
class GameUnit {
    constructor(type, hp, ap, range = 1, movement = 1, isHooman) {
        this.Range = 1;
        this.Movement = 1;
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
    CanMoveTo(target) {
        let distance = this.Cell.DistanceTo(target);
        return distance <= this.TurnMovementLeft &&
            target.Unit == undefined;
    }
    CanAttackTo(target) {
        let distance = this.Cell.DistanceTo(target);
        return distance <= this.Range &&
            target.Unit != undefined &&
            target.Unit.IsHooman != this.IsHooman &&
            this.CanAttack;
    }
}
//cache képekhez aszinkron betöltés
class ImageLoader {
    constructor() {
        this.Items = [];
        this.ImageCache = {};
        this.loadingCount = 0;
    }
    SubscribeAllLoaded(callback) {
        this.callback = callback;
        this.checkCallBack();
    }
    checkCallBack() {
        if (this.loadingCount == 0 && this.callback != undefined) {
            this.callback();
        }
    }
    ClearItems() {
        this.Items = [];
    }
    Add(item, imageSource) {
        this.Items.push(item);
        if (this.ImageCache[item.ImageKey] == undefined) {
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
}
