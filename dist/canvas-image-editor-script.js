"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const CanvasImageEditor_1 = require("./CanvasImageEditor");
const yargs_1 = __importDefault(require("yargs"));
const path_1 = __importDefault(require("path"));
const args = (0, yargs_1.default)(process.argv.slice(2))
    .option('image-file', {
    alias: 'f',
    demandOption: true,
    describe: 'Provide a pl/sql file to generate abstraction',
})
    .option('show-errors', {
    alias: 'e',
    describe: 'Display errors in the console',
    boolean: true,
    default: false,
})
    .check((argv) => {
    const sqlFilePath = path_1.default.join(__dirname, argv['image-file']);
    if (!(0, fs_1.existsSync)(sqlFilePath)) {
        throw new Error(`File not found: ${sqlFilePath}`);
    }
    return true;
})
    .help();
// const imageFilePath1 = path.join(__dirname, args.argv['image-file']);
// const imageSource1 = readFileSync(imageFilePath1, 'utf-8');
const canvasEditor = new CanvasImageEditor_1.CanvasImageEditor();
canvasEditor
    // .setLogger(ConsoleLogger)
    .toggleErrors(args.argv['show-errors'])
    .placeImage(new URL('./image1.jpg'))
    .resizeToHeight(48)
    .crop(1 / 1)
    .compose((0, CanvasImageEditor_1.toBase64)('image/jpeg', 0.8))
    .then((composeResult) => {
    console.log(composeResult.toString());
});
//# sourceMappingURL=canvas-image-editor-script.js.map