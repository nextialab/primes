var _EDGE = 40;
var _ROWS = 13;
var _COLS = 7;
var _PRIME = 2;
var _COMP = 0;
var _EMPTY = 1;
var _OFFSET_X = 6;
var _OFFSET_Y = 1;

var grid;
var _row;
var _col;
var _val = 6;
var _prime = false;
var cursors;
var primes = [2, 3, 5];
var numbers = [2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20];

function generateNext() {
    var nextIndex = Math.floor(Math.random() * numbers.length);
    _val = numbers[nextIndex];
    if (primes.indexOf(_val) != -1) {
        _prime = true;
    } else {
        _prime = false;
    }
}

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
    preload: preload,
    create: create,
    update: update
});

function preload() {
    game.load.spritesheet('tiles', 'assets/spritesheet.png', 40, 40);
}

function create() {
    grid = [];
    for (var row = 0; row < _ROWS; row++) {
        var newRow = [];
        for (var col = 0; col < _COLS; col++) {
            var cell = {};
            var x = (_OFFSET_X + col) * _EDGE;
            var y = (_OFFSET_Y + row) * _EDGE;
            cell.sprite = game.add.sprite(x, y, 'tiles', _EMPTY);
            cell.value = 0;
            cell.text = game.add.text(x + 8, y + 8, "");
            newRow[col] = cell;
        }
        grid[row] = newRow;
    }
    _row = -1;
    _col = 3;
    generateNext();
    cursors = game.input.keyboard.createCursorKeys();
    cursors.left.onDown.add(onLeft);
    cursors.right.onDown.add(onRight);
    game.time.events.loop(500, updateDown, this);
}

function onLeft() {
    if (_col > 0) {
        grid[_row][_col].value = 0;
        grid[_row][_col].text.text = "";
        grid[_row][_col].sprite.frame = _EMPTY;
        _col--;
        grid[_row][_col].value = _val;
        grid[_row][_col].text.text = _val;
        grid[_row][_col].sprite.frame = _prime ? _PRIME : _COMP;
    }
}

function onRight() {
    if (_col < _COLS - 1) {
        grid[_row][_col].value = 0;
        grid[_row][_col].text.text = "";
        grid[_row][_col].sprite.frame = _EMPTY;
        _col++;
        grid[_row][_col].value = _val;
        grid[_row][_col].text.text = _val;
        grid[_row][_col].sprite.frame = _prime ? _PRIME : _COMP;
    }
}

function update() {

}

function updateGrid() {
    var multiples = 0;
    for (var row = _row + 1; row < _ROWS; row++) {
        if (grid[row][_col].value % _val == 0) {
            grid[row][_col].value = grid[row][_col].value / _val;
            grid[row][_col].text.text = grid[row][_col].value;
            multiples++;
        }
    }
    if (multiples > 0) {
        grid[_row][_col].value = 0;
        grid[_row][_col].text.text = "";
        grid[_row][_col].sprite.frame = _EMPTY;
    }
    // remove ones and apply gravity
    // this should start from the bottom
    for (var row = _ROWS - 1; row >= _row; row--) {
        if (grid[row][_col].value == 1) {
            grid[row][_col].value = 0;
            grid[row][_col].text.text = "";
            grid[row][_col].sprite.frame = _EMPTY;
        }
    }
    for (var i = _ROWS - 1; i >= 0; i--) {
        for (var row = _ROWS - 1; row > 0; row--) {
            if (grid[row][_col].value == 0) {
                grid[row][_col].value = grid[row - 1][_col].value;
                grid[row - 1][_col].value = 0;
            }
        }
    }
    for (var row = _ROWS - 1; row >= 0; row--) {
        if (grid[row][_col].value == 0) {
            grid[row][_col].value = 0;
            grid[row][_col].text.text = "";
            grid[row][_col].sprite.frame = _EMPTY;
        } else {
            var isPrime = primes.indexOf(grid[row][_col].value) != -1;
            grid[row][_col].text.text = grid[row][_col].text.text = grid[row][_col].value;
            grid[row][_col].sprite.frame = isPrime ? _PRIME : _COMP;
        }
    }
}

function updateDown() {
    // check collision
    if (_row + 1 < _ROWS && grid[_row + 1][_col].value == 0) {
        if (_row > -1) {
            grid[_row][_col].value = 0;
            grid[_row][_col].text.text = "";
            grid[_row][_col].sprite.frame = _EMPTY;
        }
        _row++;
        grid[_row][_col].value = _val;
        grid[_row][_col].text.text = _val;
        grid[_row][_col].sprite.frame = _prime ? _PRIME : _COMP;
    } else { // next is occupied or is floor, we must generate a new one
        // first we update the grid
        if (_prime) {
            updateGrid();
        }
        _row = -1;
        generateNext();
    }
}
