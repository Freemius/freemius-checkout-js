export type ExitIntentListener = () => void;

export interface IExitIntent {
    attach(...listeners: ExitIntentListener[]): IExitIntent;

    isAttached(): boolean;

    detach(): IExitIntent;

    addListener(...listeners: ExitIntentListener[]): void;
}
