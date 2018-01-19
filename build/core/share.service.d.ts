import { IShareButton, IShareButtons, ShareButtonsConfig, ShareButtonsOptions } from './share.models';
export declare class ShareButtons {
    /** List of share buttons */
    allButtons: string[];
    /** Default options */
    options: ShareButtonsOptions;
    /** Default properties */
    prop: IShareButtons;
    /** User OS */
    os: string;
    constructor(config: ShareButtonsConfig);
    readonly twitterAccount: string;
    /**
     * Get wanted buttons
     */
    readonly buttons: string[];
    readonly theme: string;
    readonly windowSize: string;
    readonly title: string;
    readonly description: string;
    readonly image: string;
    readonly tags: string;
    readonly gaTracking: boolean;
    readonly size: number;
    registerButton(name: string, data: IShareButton): void;
}
