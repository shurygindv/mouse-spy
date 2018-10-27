const {google} = require('googleapis');
const EventEmitter = require('events');
const readline = require('readline');
const fs = require('fs');

const {SHEET_API_TYPES} = require('./types');
const {Spreadsheets} = require('../config');

const TOKEN_PATH = '/token.json';
//TODO: use async instead events
class SheetApi extends EventEmitter {
    connect() {
        fs.readFile('credentials.json', (err, content) => {
            if (err) {
                return console.log('Error loading client secret file:', err);
            }

            this._authorize(JSON.parse(content), this._notifySubscribersAfter);
        });

        return this;
    }

    _authorize (credentials, callback) {
        const {client_secret, client_id, redirect_uris} = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            
            if (err) {
                return this._getNewToken(oAuth2Client, callback);
            }

            oAuth2Client.setCredentials(JSON.parse(token));
            callback.call(this, oAuth2Client);
        });
    }

    _getNewToken (oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [Spreadsheets.Scope.Full],
          });
          console.log('Authorize this app by visiting this url:', authUrl);
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });
          rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
              if (err) return console.error('Error while trying to retrieve access token', err);
              oAuth2Client.setCredentials(token);
              // Store the token to disk for later program executions
              fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) console.error(err);
                console.log('Token stored to', TOKEN_PATH);
              });
              callback.call(this, oAuth2Client);
            });
          });
    }

    _notifySubscribersAfter (auth) {
        this.emit(SHEET_API_TYPES.AUTHORIZED, auth)
    }

}

module.exports = {
    SheetApi
}