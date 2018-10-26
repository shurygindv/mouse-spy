const _ = require('lodash');
const Mouse = require('node-mouse');

const MOUSE_TYPES = {
    LBUTTON: 0,
    MBUTTON: 1,
    RBUTTON: 2
}

const MOUSE_EVENT = {
    MOUSEDOWN: 'mousedown',
    MOUSEUP: 'mouseup',
    CLICK: 'click',
}

class MouseCounter {
    constructor () {
        this._mouse = new Mouse();

        this.LBUTTON = 0;
        this.RBUTTON = 0;
    }

    on (type, callback) {
        this._mouse.on(type, this._withDelay(callback));
    }

    _withDelay (callback) {
        return _.debounce(
            this._withResultNormalizer(callback),
            2000,
        )
    }

    _withResultNormalizer (callback) {
        return event => {
            const buttonType = _.get(event, 'button');

            switch (buttonType) {
                case MOUSE_TYPES.LBUTTON: {
                    this.LBUTTON++;
                    break;
                }
                case MOUSE_TYPES.RBUTTON: {
                    this.RBUTTON++;
                    break;
                }
            }

            callback(
                [this.LBUTTON, this.RBUTTON],
                buttonType,
            );
        }
    }
}

module.exports = {
    MouseCounter,

    MOUSE_TYPES,
    MOUSE_EVENT
};