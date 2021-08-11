NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this);
    }
};
class Game {
    newTile = null;
    constructor() {
        this.state = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];
        this.occupied = [];
        let rand1 = Math.floor(Math.random() * 4);
        let rand2 = Math.floor(Math.random() * 4);
        this.state[rand1][rand2] = 2;
        let temp;

        do {
            temp = Math.floor(Math.random() * 4);
        } while (temp == rand1 && temp == rand2);
        rand1 = temp;
        rand2 = Math.floor(Math.random() * 4);
        this.state[rand1][rand2] = 2;
        this.getOccupiedFromState();
        this.renderState();
    }
    renderState() {
        let rows = document.getElementsByClassName("row");
        let table = [
            rows[0].children,
            rows[1].children,
            rows[2].children,
            rows[3].children,
        ];
        this.state.forEach((row, i) => {
            row.forEach((cell, j) => {
                table[i][j].innerText = "";
                if (cell != 0) {
                    table[i][j].innerText = cell;
                }
            });
        });
    }
    down() {
        this.state = rotateArr(
            this.slide(rotateArr(this.state, "right")),
            "left"
        );
    }
    up() {
        this.state = rotateArr(
            this.slide(rotateArr(this.state, "left")),
            "right"
        );
    }
    left() {
        this.state = this.slide(this.state);
    }
    right() {
        this.state = rotateArr(
            rotateArr(
                this.slide(rotateArr(rotateArr(this.state, "left"), "left")),
                "right"
            ),
            "right"
        );
    }
    slide(arr) {
        arr.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell == 0) {
                    let indexOfNearest = this.findNearest(row, j);
                    arr[i][j] = row[indexOfNearest];
                    arr[i][indexOfNearest] = 0;
                }
            });
            arr[i] = this.merge(row);
        });
        return arr;
    }
    merge(arr) {
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] == arr[i + 1]) {
                arr[i] *= 2;
                arr[i + 1] = 0;
            }
        }
        // console.log(arr);
        return arr;
    }
    findNearest(row, index) {
        if (index == 3) {
            return 3;
        }
        for (let i = index; i < 4; i++) {
            if (row[i] != 0) {
                return i;
            }
        }
        return index;
    }
    getOccupiedFromState() {
        let arr = this.state;
        let retArr = [];
        arr.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell != 0) {
                    retArr.push(i * 4 + j - 2);
                }
            });
        });
        this.occupied = retArr;
    }
    addRandom() {
        let rand1;
        let rand2;
        do {
            rand1 = Math.floor(Math.random() * 4);
            rand2 = Math.floor(Math.random() * 4);
        } while (belongsTo(rand1 * 4 + rand2, this.occupied));
        console.log(rand1, rand2, rand1 * 4 + rand2);
        this.state[rand1][rand2] = 2;
        try {
            document.getElementById(this.newTile).classList.toggle("new");
            console.log("removed old");
        } catch {}
        this.newTile = rand1 * 4 + rand2;
        document.getElementById(this.newTile).classList.toggle("new");
        console.log(this.newTile);
        console.log("added new");
        this.getOccupiedFromState();
        this.renderState();
    }
    isComplete() {
        if (this.occupied.length == 16) {
            let arr = this.state;
            this.up();
            console.log(arr == this.state);
            if (arr == this.state) {
                return true;
            }
            this.state = arr;
            this.down();
            console.log(arr == this.state);

            if (arr == this.state) {
                return true;
            }
            this.state = arr;
            this.right();
            console.log(arr == this.state);

            if (arr == this.state) {
                return true;
            }
            this.state = arr;
            this.left();
            console.log(arr == this.state);

            if (arr == this.state) {
                return true;
            }
            this.state = arr;
            return false;
        }
    }
}

function belongsTo(el, arr) {
    let retBool = false;
    arr.forEach((e) => {
        if (e == el) {
            retBool = true;
        }
    });
    return retBool;
}

function rotateArr(arr, direction) {
    if (direction == "right") {
        const w = arr.length;
        const h = arr[0].length;
        let b = new Array(h);
        for (let y = 0; y < h; y++) {
            b[y] = new Array(w);
            for (let x = 0; x < w; x++) {
                b[y][x] = arr[w - 1 - x][y];
            }
        }
        return b;
    }
    if (direction == "left") {
        const w = arr.length;
        const h = arr[0].length;
        let b = new Array(h);
        for (let y = 0; y < h; y++) {
            b[y] = new Array(w);
            for (let x = 0; x < w; x++) {
                b[y][x] = arr[x][h - 1 - y];
            }
        }
        return b;
    }
}

function subtractArrays(arr1, arr2) {
    let returnArr = [];
    arr1.forEach((el) => {
        if (!belongsTo(el, arr2)) {
            returnArr.push(el);
        }
    });
    return returnArr;
}

const game = new Game();

window.addEventListener("keydown", (event) => {
    if (event.key == "w" || event.key == "ArrowUp") {
        game.up();
        game.addRandom();
        if (game.isComplete()) {
            alert("game Over");
        }
    }
    if (event.key == "s" || event.key == "ArrowDown") {
        game.down();
        game.addRandom();
        if (game.isComplete()) {
            alert("game Over");
        }
    }
    if (event.key == "a" || event.key == "ArrowLeft") {
        game.left();
        game.addRandom();
        if (game.isComplete()) {
            alert("game Over");
        }
    }
    if (event.key == "d" || event.key == "ArrowRight") {
        game.right();
        game.addRandom();
        if (game.isComplete()) {
            alert("game Over");
        }
    }
});
