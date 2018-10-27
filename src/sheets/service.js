const {google} = require('googleapis');
const _ = require('lodash');
const util = require('util');

class SheetService {
    constructor (authContext, options) {
        this._sheets = google.sheets({
            version: 'v4', auth: authContext
        });

        this._options = {
            spreadsheetId: options.spreadsheetId,
        };
    }

    _getValues (params) {
        return new Promise(resolver => {
            this._sheets.spreadsheets.values.get(params, (err, res) => {
                if (err) {
                    return console.log(err);
                }

                resolver(res);
            })
        })
    }

    async _updateValues (params) {
        return new Promise(resolver => {
            this._sheets.spreadsheets.values.update(params, (err, res) => {
                if (err) {
                    return console.log(err);
                }

                resolver(res);
            })
        })
    }

    async get (options) {
        let result = null;

        try {
            result = await this._getValues(
                _.assign(this._options, options)
            );
        } catch (e) {
            return console.log(e);
        }

        return _.get(result, 'data.values');
    }

    async update (params) {
        let result = null;
        try {
            result = await this._updateValues(
                mapParamsToUpdate(params, this._options)
            );
        } catch (e) {
            return console.log(e);
        }

        return result;
    }
}



function mapParamsToUpdate (current, options) {
    return {
        spreadsheetId: options.spreadsheetId,
        range: options.range,

        valueInputOption: current.valueInputOption,
        resource: current.resource
    }
}

module.exports = {
    SheetService
}