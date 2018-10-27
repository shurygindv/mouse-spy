const _ = require('lodash');
const {MOUSE_EVENT} = require('./counter/mouse');

const SHEET_ACTIONS = {
    GET: "GET",
    UPDATE: "UPDATE",
}

class MouseSheetAdapter {
    constructor(options) {

        this._sync = options.sync;
        this._middlewares = options.middlewares;
        this._mouseCounter = options.mouseCounter
        this._sheetService = options.sheetService;

        this._params = options.params;

        //bindings
        this._handleOnMouseClick = _.throttle(
            this._handleOnMouseClick.bind(this),
            1500000
        );
    }

    init() {
        this._subscribeOnMouse();
        this._fetchInitialValue()
    }

    _subscribeOnMouse() {
        this._mouseCounter.on(MOUSE_EVENT.CLICK, this._handleOnMouseClick)
    }

    async _fetchInitialValue() {
        let result = null;

        try {
            result = await this._getCell();
        } catch (e) {
            console.log(`Error: ${e}`);
        }

        this._setMouseState(result);
    }

    async _handleOnMouseClick(values) {
        console.log("<Clicks>")
        console.log(values);
        console.log("--------")

        try {
            await this._updateCell({
                resource: {
                    values: [values]
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    _setMouseState([[LButton, RButton]]) {
        console.log("==Default state==")
        console.log(...arguments);
        console.log("=================")

        this._mouseCounter.setState(
            LButton,
            RButton,
        );
    }

    async _getCell(params) {
        const requestParams = this._buildMiddlewareRequest(
            SHEET_ACTIONS.GET,
            params
        );

        try {
            return await this._sheetService.get(requestParams);
        } catch (e) {
            console.log(`Error: ${e}`);
        }
    }

    async _updateCell(params) {
        const requestParams = this._buildMiddlewareRequest(
            SHEET_ACTIONS.UPDATE,
            params
        );

        try {
            return await this._sheetService.update(requestParams);
        } catch (e) {
            console.log(`Error: ${e}`);
        }
    }

    _buildMiddlewareRequest(type, preparedForRequest) {

        return this._middlewares.reduce((prev, current) => {

            if (current.test === type) {
                return _.assign(prev, current.use(prev));
            }

            return prev;
        }, preparedForRequest);
    }
}

module.exports = {
    SHEET_ACTIONS,
    MouseSheetAdapter,
}