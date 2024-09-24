export interface IStyle {
    readonly isFlashingBrowser: boolean;

    readonly guid: string;

    addStyle(style: string): void;
    attach(): IStyle;
    remove(): IStyle;

    disableBodyScroll(): void;
    enableBodyScroll(): void;

    disableMetaColorScheme(): void;
    enableMetaColorScheme(): void;
}
