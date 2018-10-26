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

        this.LBUTTON = 5;
        this.RBUTTON = 3;
    }

    on (type, callback) {
        this._mouse.on(type, this._withDelay(callback));
    }

    _withDelay (callback) {
        const debounced = _.throttle(
            callback,
            60000
        );
        return this._withResultNormalizer(debounced)
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