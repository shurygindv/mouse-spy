
class Cell {
    constructor (options) {
        this._value = options.initialCell;
    }

    value () {
        return this._value;
    }
}

module.exports = {
    Cell
};