import { InjectionToken } from '@angular/core';
import { ShareButtons } from './share.service';
import { ShareButtonsConfig } from './share.models';
export declare function ShareButtonsFactory(config: ShareButtonsConfig): ShareButtons;
/** TODO: remove CommonModule */
export declare class ShareModule {
    static forRoot(config?: ShareButtonsConfig): {
        ngModule: typeof ShareModule;
        providers: ({
            provide: InjectionToken<ShareButtonsConfig>;
            useValue: ShareButtonsConfig;
        } | {
            provide: typeof ShareButtons;
            useFactory: (config: ShareButtonsConfig) => ShareButtons;
            deps: InjectionToken<ShareButtonsConfig>[];
        })[];
    };
}
