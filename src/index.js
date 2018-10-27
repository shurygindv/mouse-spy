const {MouseSheetAdapter, SHEET_ACTIONS} = require('./mouse-sheet-adapter')
const {MouseCounter}                     = require('./counter/mouse');
const {SHEET_API_TYPES}                  = require('./sheets/types');
const {SheetService}                     = require('./sheets/service');
const {SheetApi}                         = require('./sheets/api');
const {Cell}                             = require ('./helpers/cell')


const sheetApi = new SheetApi();

sheetApi
    .connect()
    .on(SHEET_API_TYPES.AUTHORIZED, createAdapter);

const createSheetService = (authContext) => (
    new SheetService(authContext, {
        spreadsheetId: "1SUjOytdmmOv17pN4eh5nIRnjNtKqZepejm6VGO-ySwg",
    })
)

const createChangeableCell = (initialCell) => (
    new Cell({
        initialCell: initialCell,
        incrementIf: undefined,
    })
);

const createMouseCounter = () => (
    new MouseCounter()
);

function createAdapter(authContext) {
    const sheetService = createSheetService(authContext);
    const mouseCounter = createMouseCounter();
    const cell         = createChangeableCell('AN53:AO53');

    const adapter = new MouseSheetAdapter({
        sheetService: sheetService,
        mouseCounter: mouseCounter,
        middlewares : [{
            test: SHEET_ACTIONS.GET,
            use : (queryParams) => {
                return {
                    ...queryParams,
                    range: cell.value(),
                };
            }
        }, {
            test: SHEET_ACTIONS.UPDATE,
            use : (queryParams) => {
                return {
                    ...queryParams,
                    valueInputOption: 'RAW',
                    range           : cell.value(),
                };
            }
        }]
    });

    adapter.init();
}
