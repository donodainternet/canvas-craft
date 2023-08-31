type Logger = {
    debug(message: string, context?: unknown): void;
    info(message: string, context?: unknown): void;
    warn(message: string, context?: unknown): void;
    error(message: string, context?: unknown): void;
};

interface CliOptions {
    'image-file': string;
    'show-errors': boolean;
};

interface ProcessingError {
    'type': 'parserError' | 'lexerError';
    'line': number;
    'charPosition': number;
    'msg': string;
};

interface Element {
    compose(): Element
};

type TargetMimetype = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/bmp' | 'image/webp';

export type ComposeTargetFunction = (canvas: HTMLCanvasElement) => ComposeResult;

export type ComposeTarget = (mimetype?: TargetMimetype, quality?: number) => ComposeTargetFunction;