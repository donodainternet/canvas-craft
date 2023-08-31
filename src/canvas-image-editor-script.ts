import {existsSync} from 'fs';
import {CanvasImageEditor, toBase64} from './CanvasImageEditor';
import yargs from 'yargs';
import {CliOptions} from './typings/CanvasImageEditor';
import path from 'path';
import {ComposeResult} from './ComposeResult';

const args = yargs(process.argv.slice(2))
    .option('image-file', {
      alias: 'f',
      demandOption: true,
      describe: 'Provide a image file',
    })
    .option('show-errors', {
      alias: 'e',
      describe: 'Display errors in the console',
      boolean: true,
      default: false,
    })
    .check((argv: yargs.Arguments<CliOptions>) => {
      const sqlFilePath = path.join(__dirname, argv['image-file']);
      if (!existsSync(sqlFilePath)) {
        throw new Error(`File not found: ${sqlFilePath}`);
      }
      return true;
    })
    .help();

// const imageFilePath1 = path.join(__dirname, args.argv['image-file']);
// const imageSource1 = readFileSync(imageFilePath1, 'utf-8');

const canvasEditor = new CanvasImageEditor();
canvasEditor
    // .setLogger(ConsoleLogger)
    .toggleErrors(args.argv['show-errors'])
    .placeImage(new URL('./image1.jpg'))
    .resizeToHeight(48)
    .crop(1/1)
    .compose(toBase64('image/jpeg', 0.8))
    .then((composeResult: ComposeResult) => {
      console.log(composeResult.toString());
    });
