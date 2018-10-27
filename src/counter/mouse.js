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

        this._LButton = 0;
        this._RButton = 0;
    }

    on (type, callback) {
        this._mouse.on(type, this._withResultNormalizer(callback));
    }

    setState (LButton, RButton) {
        this._LButton = LButton;
        this._RButton = RButton;
    }

    _withResultNormalizer (onEventHandle) {
        return event => {
            const buttonType = _.get(event, 'button');

            switch (buttonType) {
                case MOUSE_TYPES.LBUTTON: {
                    this._LButton++;
                    break;
                }
                case MOUSE_TYPES.RBUTTON: {
                    this._RButton++;
                    break;
                }
            }

            onEventHandle(
                [this._LButton, this._RButton],
            );
        }
    }
}

module.exports = {
    MouseCounter,

    MOUSE_TYPES,
    MOUSE_EVENT
};