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
    constructor (options) {
        this._mouse = new Mouse();

        this.LBUTTON = 365;
        this.RBUTTON = 3;

        this._options = {
            timer: options.timer,
        };
    }

    on (type, callback) {
        this._mouse.on(type, this._withDelay(callback));
    }

    _getTimeRange () {
        return this._options.timer.getTime();
    }

    _withDelay (callback) {
        const delay =  this._getTimeRange();
        const throttledCallback = _.throttle(callback, delay);

        console.log(`Delayed in <${delay}>`);

        return this._withResultNormalizer(throttledCallback)
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