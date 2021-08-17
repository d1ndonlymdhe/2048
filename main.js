// const { cloneDeep } = require("lodash");

let gameHistory = [];

class Game {
    newTile = null;
    // stateHistory = [];
    movesCounter = 0;
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
                console.log(table[i][j]);
                table[i][j].children[0].innerText = "";
                if (cell != 0) {
                    table[i][j].children[0].innerText = cell;
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
                    retArr.push(i * 4 + j);
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
    // addStateHistory() {
    //     this.stateHistory.push(this.state);
    // }
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

function addGameHistory() {
    let x = _.cloneDeep(game);
    if (gameHistory.length > 5) {
        gameHistory.reverse();
        gameHistory.pop();
        gameHistory.reverse();
    }
    gameHistory.push(x);
}

let game = new Game();

window.addEventListener("keydown", handleClick(event));

let handleClick = (event) => {
    if (event.key == "w" || event.key == "ArrowUp") {
        addGameHistory();
        console.log(gameHistory, game);
        game.up();
        game.getOccupiedFromState();
        game.addRandom();
        game.movesCounter++;
    }
    if (event.key == "s" || event.key == "ArrowDown") {
        addGameHistory();
        game.down();
        game.getOccupiedFromState();
        game.addRandom();
        game.movesCounter++;
    }
    if (event.key == "a" || event.key == "ArrowLeft") {
        addGameHistory();
        game.left();
        game.getOccupiedFromState();
        game.addRandom();

        game.movesCounter++;
    }
    if (event.key == "d" || event.key == "ArrowRight") {
        addGameHistory();
        game.right();
        game.getOccupiedFromState();
        game.addRandom();

        game.movesCounter++;
    }
};

document.getElementById("undo").addEventListener("click", (event) => {
    if (gameHistory.length > 1) {
        game = gameHistory[gameHistory.length - 1];
        gameHistory.pop();
        // game.movesCounter--;
        for (let i = 0; i < 16; i++) {
            if (belongsTo("new", document.getElementById(i).classList)) {
                document.getElementById(i).classList.toggle("new");
            }
        }
        console.log(game.newTile);
        document.getElementById(game.newTile).classList.toggle("new");
        console.log(game.newTile);
        console.log("added new");
        game.getOccupiedFromState();
        game.renderState();
    }
});
