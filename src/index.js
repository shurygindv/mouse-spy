const {MOUSE_EVENT, MouseCounter} = require('./counter/mouse');
const {SHEET_API_TYPES} = require('./sheets/types');
const {SheetService} = require('./sheets/service');
const {SheetApi} = require('./sheets/api');

const mouseCounter = new MouseCounter();
const sheetApi = new SheetApi();

sheetApi.on(SHEET_API_TYPES.AUTHORIZED, createSheetService);

sheetApi.connect();

function createSheetService(authContext) {
    const sheetService = new SheetService(authContext, {
        spreadsheetId: "1SUjOytdmmOv17pN4eh5nIRnjNtKqZepejm6VGO-ySwg",
        range: 'AN52:AO52',
    });

    mouseCounter.on(MOUSE_EVENT.MOUSEDOWN, async (values) => {
    
        const result = await sheetService.update({
            valueInputOption: 'RAW',
            resource: {
                values: [values],
            }
        });

        console.log(result);
    });
}