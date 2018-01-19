import { ChangeDetectorRef, Directive, ElementRef, EventEmitter, HostListener, Inject, Injectable, InjectionToken, Input, NgModule, Output, Pipe, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, delay, map, take, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { empty as empty$1 } from 'rxjs/observable/empty';
import { of as of$1 } from 'rxjs/observable/of';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const CONFIG = new InjectionToken('CONFIG');

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * None operator - just return the sharer URL
 */
const noneOperator = map((ref) => ref.prop.share[ref.os] + ref.url);
/**
 * Meta tags operator - Serialize meta tags in the sharer URL
 */
const metaTagsOperator = map((ref) => {
    /**
     * Social network supported meta tags
     */
    const /** @type {?} */ metaTags = ref.prop.share.metaTags;
    /**
     * User meta tags values
     */
    const /** @type {?} */ metaTagsValues = ref.metaTags;
    /**
     * Social network sharer URL
     */
    const /** @type {?} */ SharerURL = ref.prop.share[ref.os];
    /**
     * User share link
     */
    let /** @type {?} */ link = ref.url;
    /** Loop over meta tags */
    if (metaTags) {
        Object.keys(metaTags).map((key) => {
            if (metaTagsValues[key]) {
                link += `&${metaTags[key]}=${metaTagsValues[key]}`;
            }
        });
    }
    return SharerURL + link;
});
/**
 * Print button operator
 */
const printOperator = map((ref) => ref.window.print());
/**
 * Pinterest operator - Since Pinterest requires the description and image meta tags,
 * this function checks if the meta tags are presented, if not it falls back to page meta tags
 * This should placed after the metaTagsOperator
 */
const pinterestOperator = map((url) => {
    if (!url.includes('&description')) {
        /**
         * If user didn't add description, get it from the OG meta tag
         */
        const /** @type {?} */ ogDescription = document.querySelector(`meta[property="og:description"]`);
        if (ogDescription) {
            url += '&description=' + ogDescription.getAttribute('content');
        }
        else {
            console.warn(`[ShareButtons]: You didn't set the description text for Pinterest button`);
        }
    }
    if (!url.includes('&media')) {
        const /** @type {?} */ ogImage = document.querySelector(`meta[property="og:image"]`);
        if (ogImage) {
            url += '&media=' + ogImage.getAttribute('content');
        }
        else {
            console.warn(`[ShareButtons]: You didn't set the image URL for Pinterest button`);
        }
    }
    return url;
});
/**
 * Copy button operator - to copy link to clipboard
 */
const copyOperators = [
    map((ref) => {
        /** Disable button click */
        ref.renderer.setStyle(ref.el, 'pointer-events', 'none');
        ref.temp = { text: ref.prop.text, icon: ref.prop.icon };
        const /** @type {?} */ link = decodeURIComponent(ref.url);
        /**
         * Create a hidden textarea element
         */
        const /** @type {?} */ textArea = ref.renderer.createElement('textarea');
        textArea.style.position = 'fixed';
        textArea.style.top = 0;
        textArea.style.left = 0;
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = 0;
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        textArea.value = link;
        ref.renderer.appendChild(ref.el, textArea);
        /** highlight and copy the text */
        textArea.select();
        document.execCommand('copy');
        ref.renderer.removeChild(ref.el, textArea);
        /** Set success text and icon on button */
        ref.prop.text = ref.prop.successText;
        ref.prop.icon = ref.prop.successIcon;
        ref.cd.markForCheck();
        return ref;
    }, (ref) => {
        /** Set error text and icon on button */
        ref.prop.text = ref.prop.failText;
        ref.prop.icon = ref.prop.failIcon;
        ref.cd.markForCheck();
        console.warn('[ShareButtons]: Print button could not copy URL to clipboard');
    }),
    delay(2000),
    map((ref) => {
        /** Enable button click */
        ref.renderer.setStyle(ref.el, 'pointer-events', 'auto');
        /** Set the default text and icon back */
        ref.prop.text = ref.temp.text;
        ref.prop.icon = ref.temp.icon;
        ref.cd.markForCheck();
    })
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const shareButtonsProp = {
    facebook: {
        type: 'facebook',
        text: 'Facebook',
        icon: 'fa fa-facebook',
        color: '#3b5998',
        share: {
            desktop: 'https://www.facebook.com/sharer/sharer.php?u=',
            android: 'https://www.facebook.com/sharer/sharer.php?u=',
            ios: 'https://www.facebook.com/sharer/sharer.php?u=',
            operators: [noneOperator]
        },
        count: {
            request: 'http',
            url: 'https://graph.facebook.com?id=',
            operators: [
                map((res) => +res.share.share_count)
            ]
        }
    },
    twitter: {
        type: 'twitter',
        text: 'Twitter',
        icon: 'fa fa-twitter',
        color: '#00acee',
        share: {
            desktop: 'https://twitter.com/intent/tweet?url=',
            android: 'https://twitter.com/intent/tweet?url=',
            ios: 'https://twitter.com/intent/tweet?url=',
            operators: [
                metaTagsOperator
            ],
            metaTags: {
                description: 'text',
                tags: 'hashtags',
                via: 'via'
            }
        }
    },
    google: {
        type: 'google',
        text: 'Google+',
        icon: 'fa fa-google-plus',
        color: '#DB4437',
        share: {
            desktop: 'https://plus.google.com/share?url=',
            android: 'https://plus.google.com/share?url=',
            ios: 'https://plus.google.com/share?url=',
            operators: [noneOperator],
        }
    },
    linkedin: {
        type: 'linkedin',
        text: 'LinkedIn',
        icon: 'fa fa-linkedin',
        color: '#006fa6',
        share: {
            desktop: 'http://www.linkedin.com/shareArticle?url=',
            android: 'http://www.linkedin.com/shareArticle?url=',
            ios: 'http://www.linkedin.com/shareArticle?url=',
            operators: [metaTagsOperator],
            metaTags: {
                title: 'title',
                description: 'summary'
            },
        },
        count: {
            request: 'jsonp',
            url: 'https://www.linkedin.com/countserv/count/share?url=',
            operators: [
                map((res) => +res.count)
            ]
        }
    },
    pinterest: {
        type: 'pinterest',
        text: 'Pinterest',
        icon: 'fa fa-pinterest-p',
        color: '#BD091D',
        share: {
            desktop: 'https://in.pinterest.com/pin/create/button/?url=',
            android: 'https://in.pinterest.com/pin/create/button/?url=',
            ios: 'https://in.pinterest.com/pin/create/button/?url=',
            operators: [
                metaTagsOperator,
                pinterestOperator
            ],
            metaTags: {
                description: 'description',
                image: 'media'
            }
        },
        count: {
            request: 'http',
            url: 'https://api.pinterest.com/v1/urls/count.json?url=',
            args: { responseType: 'text' },
            operators: [
                map((text) => JSON.parse(text.replace(/^receiveCount\((.*)\)/, '$1'))),
                map((res) => +res.count)
            ]
        }
    },
    reddit: {
        type: 'reddit',
        text: 'Reddit',
        icon: 'fa fa-reddit-alien',
        color: '#FF4006',
        share: {
            desktop: 'http://www.reddit.com/submit?url=',
            android: 'http://www.reddit.com/submit?url=',
            ios: 'http://www.reddit.com/submit?url=',
            operators: [
                metaTagsOperator
            ],
            metaTags: {
                title: 'title'
            },
        },
        count: {
            request: 'http',
            url: 'https://buttons.reddit.com/button_info.json?url=',
            operators: [
                map((res) => +res.data.children[0].data.score)
            ]
        },
    },
    tumblr: {
        type: 'tumblr',
        text: 'Tumblr',
        icon: 'fa fa-tumblr',
        color: '#36465D',
        share: {
            desktop: 'http://tumblr.com/widgets/share/tool?canonicalUrl=',
            android: 'http://tumblr.com/widgets/share/tool?canonicalUrl=',
            ios: 'http://tumblr.com/widgets/share/tool?canonicalUrl=',
            operators: [
                metaTagsOperator
            ],
            metaTags: {
                description: 'caption',
                tags: 'tags'
            }
        },
        count: {
            request: 'jsonp',
            url: 'https://api.tumblr.com/v2/share/stats?url=',
            operators: [
                map((res) => +res.response.note_count)
            ]
        }
    },
    whatsapp: {
        type: 'whatsapp',
        text: 'WhatsApp',
        icon: 'fa fa-whatsapp',
        color: '#25D366',
        share: {
            desktop: 'https://web.whatsapp.com/send?',
            android: 'https://web.whatsapp.com/send?',
            ios: 'https://web.whatsapp.com/send?',
            operators: [metaTagsOperator],
            metaTags: {
                description: 'text'
            }
        }
    },
    telegram: {
        type: 'telegram',
        text: 'Telegram',
        icon: 'fa fa-send',
        color: '#0088cc',
        share: {
            desktop: 'https://t.me/share/url?url=',
            android: 'https://t.me/share/url?url=',
            ios: 'https://t.me/share/url?url=',
            operators: [metaTagsOperator],
            metaTags: {
                description: 'text'
            }
        }
    },
    vk: {
        type: 'vk',
        text: 'VKontakte',
        icon: 'fa fa-vk',
        color: '#4C75A3',
        share: {
            desktop: 'http://vk.com/share.php?url=',
            android: 'http://vk.com/share.php?url=',
            ios: 'http://vk.com/share.php?url=',
            operators: [noneOperator]
        }
    },
    stumble: {
        type: 'stumble',
        text: 'Stumble',
        icon: 'fa fa-stumbleupon',
        color: '#eb4924',
        share: {
            desktop: 'http://www.stumbleupon.com/submit?url=',
            android: 'http://www.stumbleupon.com/submit?url=',
            ios: 'http://www.stumbleupon.com/submit?url=',
            operators: [noneOperator],
        }
    },
    email: {
        type: 'email',
        text: 'Email',
        icon: 'fa fa-envelope',
        color: '#32A1A3',
        share: {
            desktop: 'mailto:?',
            android: 'mailto:?',
            ios: 'mailto:?',
            operators: [metaTagsOperator],
            metaTags: {
                title: 'subject',
                description: 'body'
            }
        }
    },
    copy: {
        type: 'copy',
        text: 'Copy link',
        successText: 'Copied',
        successIcon: 'fa fa-check',
        failText: 'Error',
        failIcon: 'fa fa-exclamation',
        icon: 'fa fa-link',
        color: '#607D8B',
        share: {
            operators: copyOperators
        }
    },
    print: {
        type: 'print',
        text: 'Print',
        icon: 'fa fa-print',
        color: 'brown',
        share: {
            operators: [printOperator]
        }
    },
    ok: {
        type: 'ok',
        text: 'Odnoclassniki',
        icon: 'none',
        color: '#4C75A3',
        share: {
            desktop: 'https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=',
            android: 'https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=',
            ios: 'https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=',
            operators: [noneOperator]
        }
    },
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ShareButtons {
    /**
     * @param {?} config
     */
    constructor(config) {
        /** Set buttons properties */
        this.prop = shareButtonsProp;
        /** Set buttons list */
        this.allButtons = Object.keys(this.prop);
        /** Set default options */
        this.options = {
            theme: 'default',
            include: this.allButtons,
            exclude: [],
            size: 0,
            title: null,
            image: null,
            description: null,
            tags: null,
            gaTracking: false,
            twitterAccount: null,
            windowWidth: 800,
            windowHeight: 500
        };
        if (config) {
            /** Override global options with user's preference */
            this.options = mergeDeep(this.options, config.options);
            this.prop = mergeDeep(this.prop, config.prop);
        }
        /** Get user browser info */
        this.os = getOS();
    }
    /**
     * @return {?}
     */
    get twitterAccount() {
        return this.options.twitterAccount;
    }
    /**
     * Get wanted buttons
     * @return {?}
     */
    get buttons() {
        if (!this.options.exclude.length) {
            return this.options.include;
        }
        return this.options.include.filter((btn) => this.options.exclude.indexOf(btn) < 0);
    }
    /**
     * @return {?}
     */
    get theme() {
        return this.options.theme;
    }
    /**
     * @return {?}
     */
    get windowSize() {
        return `width=${this.options.windowWidth}, height=${this.options.windowHeight}`;
    }
    /**
     * @return {?}
     */
    get title() {
        return this.options.title;
    }
    /**
     * @return {?}
     */
    get description() {
        return this.options.description;
    }
    /**
     * @return {?}
     */
    get image() {
        return this.options.image;
    }
    /**
     * @return {?}
     */
    get tags() {
        return this.options.tags;
    }
    /**
     * @return {?}
     */
    get gaTracking() {
        return this.options.gaTracking;
    }
    /**
     * @return {?}
     */
    get size() {
        return this.options.size;
    }
    /**
     * @param {?} name
     * @param {?} data
     * @return {?}
     */
    registerButton(name, data) {
        this.prop = Object.assign({}, shareButtonsProp, { [name]: data });
        this.allButtons = Object.keys(this.prop);
    }
}
ShareButtons.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ShareButtons.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [CONFIG,] },] },
];
/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 * @return {?}
 */
function getOS() {
    const /** @type {?} */ userAgent = navigator.userAgent || navigator.vendor || (window || global).opera;
    if (/android/i.test(userAgent)) {
        return 'android';
    }
    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window || global).MSStream) {
        return 'ios';
    }
    return 'desktop';
}
/**
 * Simple object check.
 * @param {?} item
 * @return {?}
 */
function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}
/**
 * Deep merge two objects.
 * @param {?} target
 * @param {...?} sources
 * @return {?}
 */
function mergeDeep(target, ...sources) {
    if (!sources.length) {
        return target;
    }
    const /** @type {?} */ source = sources.shift();
    if (isObject(target) && isObject(source)) {
        for (const /** @type {?} */ key in source) {
            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, { [key]: {} });
                }
                mergeDeep(target[key], source[key]);
            }
            else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    return mergeDeep(target, ...sources);
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ShareButtonDirective {
    /**
     * @param {?} shareService
     * @param {?} http
     * @param {?} renderer
     * @param {?} cd
     * @param {?} el
     */
    constructor(shareService, http$$1, renderer, cd, el) {
        this.shareService = shareService;
        this.http = http$$1;
        this.renderer = renderer;
        this.cd = cd;
        this.el = el;
        /**
         * Meta tags inputs - initialized from the global options
         */
        this.sbTitle = this.shareService.title;
        this.sbDescription = this.shareService.description;
        this.sbImage = this.shareService.image;
        this.sbTags = this.shareService.tags;
        /**
         * Share count event
         */
        this.sbCount = new EventEmitter();
        /**
         * Share dialog opened event
         */
        this.sbOpened = new EventEmitter();
        /**
         * Share dialog closed event
         */
        this.sbClosed = new EventEmitter();
        this.window = window || global;
    }
    /**
     * Create share button
     * @param {?} buttonName
     * @return {?}
     */
    set setButton(buttonName) {
        /**
         * Create a new button of type <buttonName>
         */
        const /** @type {?} */ button = Object.assign({}, this.shareService.prop[buttonName]);
        if (button) {
            /** Set share button */
            this.prop = button;
            /** Remove previous button class */
            this.renderer.removeClass(this.el.nativeElement, 'sb-' + this.buttonClass);
            /** Add new button class */
            this.renderer.addClass(this.el.nativeElement, 'sb-' + button.type);
            /** Keep a copy of the class for future replacement */
            this.buttonClass = button.type;
            /** Get link's shared count */
            this.emitCount();
        }
        else {
            throw new Error(`[ShareButtons]: The share button '${buttonName}' does not exist!`);
        }
    }
    /**
     * Set share URL
     * @param {?} newUrl
     * @return {?}
     */
    set sbUrl(newUrl) {
        /** Check if new URL is equal the current URL */
        if (newUrl !== this.url) {
            this.url = this.getValidURL(newUrl);
            this.emitCount();
        }
    }
    /**
     * Share link on element click
     * @return {?}
     */
    onClick() {
        /** Set user did not set the url using [sbUrl], use window URL */
        if (!this.url) {
            this.url = encodeURIComponent(this.window.location.href);
        }
        /** Emit opened share button type */
        this.sbOpened.emit(this.prop.type);
        const /** @type {?} */ ref = {
            url: this.url,
            cd: this.cd,
            renderer: this.renderer,
            window: this.window,
            prop: this.prop,
            el: this.el.nativeElement,
            os: this.shareService.os,
            metaTags: {
                title: this.sbTitle,
                description: this.sbDescription,
                image: this.sbImage,
                tags: this.sbTags,
                via: this.shareService.twitterAccount,
            }
        };
        /** Share the link */
        of$1(ref).pipe(...this.prop.share.operators, tap((sharerURL) => this.share(sharerURL)), take(1)).subscribe();
    }
    /**
     * Emit share count
     * @return {?}
     */
    emitCount() {
        /** Only if share count has observers & the button has support for share count */
        if (this.url && this.sbCount.observers.length && this.prop.count) {
            /** Emit share count to (sbCount) Output */
            this.count(this.url).subscribe((count) => this.sbCount.emit(count));
        }
    }
    /**
     * Open sharing window
     * @param {?} url - Share URL
     * @return {?}
     */
    share(url) {
        let /** @type {?} */ popUp;
        if (url) {
            /** GA tracking */
            if (this.shareService.gaTracking && typeof ga !== 'undefined') {
                ga('send', 'social', this.prop.type, 'click', this.url);
            }
            popUp = this.window.open(url, 'newwindow', this.shareService.windowSize);
        }
        /** If dialog closed event has subscribers, emit closed dialog type */
        if (this.sbClosed.observers.length && popUp) {
            const /** @type {?} */ pollTimer = this.window.setInterval(() => {
                if (popUp.closed) {
                    this.window.clearInterval(pollTimer);
                    this.sbClosed.emit(this.prop.type);
                }
            }, 200);
        }
    }
    /**
     * Get link share count
     * @param {?} url - Share URL
     * @return {?} Share count
     */
    count(url) {
        if (this.prop.count.request === 'jsonp') {
            return this.http.jsonp(this.prop.count.url + url, 'callback').pipe(...this.prop.count.operators, catchError(() => empty$1()));
        }
        else {
            return this.http.get(this.prop.count.url + url, this.prop.count.args).pipe(...this.prop.count.operators, catchError(() => empty$1()));
        }
    }
    /**
     * Get a valid URL for sharing
     * @param {?} url - URL to validate
     * @return {?} Sharable URL
     */
    getValidURL(url) {
        if (url) {
            const /** @type {?} */ r = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
            if (r.test(url)) {
                return encodeURIComponent(url);
            }
            console.warn(`[ShareButtons]: Sharing link '${url}' is invalid!`);
        }
        /** fallback to page current URL */
        return encodeURIComponent(this.window.location.href);
    }
}
ShareButtonDirective.decorators = [
    { type: Directive, args: [{
                selector: '[shareButton]'
            },] },
];
/** @nocollapse */
ShareButtonDirective.ctorParameters = () => [
    { type: ShareButtons, },
    { type: HttpClient, },
    { type: Renderer2, },
    { type: ChangeDetectorRef, },
    { type: ElementRef, },
];
ShareButtonDirective.propDecorators = {
    "sbTitle": [{ type: Input },],
    "sbDescription": [{ type: Input },],
    "sbImage": [{ type: Input },],
    "sbTags": [{ type: Input },],
    "setButton": [{ type: Input, args: ['shareButton',] },],
    "sbUrl": [{ type: Input },],
    "sbCount": [{ type: Output },],
    "sbOpened": [{ type: Output },],
    "sbClosed": [{ type: Output },],
    "onClick": [{ type: HostListener, args: ['click',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class NFormatterPipe {
    /**
     * @param {?} num
     * @param {?=} digits
     * @return {?}
     */
    transform(num, digits) {
        if (typeof num !== 'number') {
            num = 1;
        }
        return nFormatter(num, digits);
    }
}
NFormatterPipe.decorators = [
    { type: Pipe, args: [{
                name: 'nFormatter'
            },] },
];
/** @nocollapse */
NFormatterPipe.ctorParameters = () => [];
/**
 * Change share counts to a readable number
 */
const nFormatter = (num, digits) => {
    const /** @type {?} */ si = [
        { value: 1E18, symbol: 'E' },
        { value: 1E15, symbol: 'P' },
        { value: 1E12, symbol: 'T' },
        { value: 1E9, symbol: 'G' },
        { value: 1E6, symbol: 'M' },
        { value: 1E3, symbol: 'K' }
    ], /** @type {?} */ rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    for (let /** @type {?} */ i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
            return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
        }
    }
    return num.toFixed(digits).replace(rx, '$1');
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} config
 * @return {?}
 */
function ShareButtonsFactory(config) {
    return new ShareButtons(config);
}
/**
 * TODO: remove CommonModule
 */
class ShareModule {
    /**
     * @param {?=} config
     * @return {?}
     */
    static forRoot(config) {
        return {
            ngModule: ShareModule,
            providers: [
                { provide: CONFIG, useValue: config },
                {
                    provide: ShareButtons,
                    useFactory: ShareButtonsFactory,
                    deps: [CONFIG]
                }
            ]
        };
    }
}
ShareModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    ShareButtonDirective,
                    NFormatterPipe
                ],
                imports: [
                    CommonModule
                ],
                exports: [
                    CommonModule,
                    ShareButtonDirective,
                    NFormatterPipe
                ]
            },] },
];
/** @nocollapse */
ShareModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { ShareButtonsFactory, ShareModule, CONFIG, ShareButtons, ShareButtonDirective, NFormatterPipe, nFormatter };
//# sourceMappingURL=ngx-share-core.js.map
