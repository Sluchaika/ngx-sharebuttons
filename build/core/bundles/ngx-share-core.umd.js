(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('rxjs/operators'), require('@angular/common/http'), require('rxjs/observable/empty'), require('rxjs/observable/of')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', 'rxjs/operators', '@angular/common/http', 'rxjs/observable/empty', 'rxjs/observable/of'], factory) :
	(factory((global['ngx-share'] = global['ngx-share'] || {}, global['ngx-share'].core = {}),global.ng.core,global.ng.common,global.Rx.Observable.prototype,global.ng.common.http,global.Rx.Observable,global.Rx.Observable));
}(this, (function (exports,core,common,operators,http,empty,of) { 'use strict';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var CONFIG = new core.InjectionToken('CONFIG');
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * None operator - just return the sharer URL
 */
var noneOperator = operators.map(function (ref) { return ref.prop.share[ref.os] + ref.url; });
/**
 * Meta tags operator - Serialize meta tags in the sharer URL
 */
var metaTagsOperator = operators.map(function (ref) {
    /**
     * Social network supported meta tags
     */
    var /** @type {?} */ metaTags = ref.prop.share.metaTags;
    /**
     * User meta tags values
     */
    var /** @type {?} */ metaTagsValues = ref.metaTags;
    /**
     * Social network sharer URL
     */
    var /** @type {?} */ SharerURL = ref.prop.share[ref.os];
    /**
     * User share link
     */
    var /** @type {?} */ link = ref.url;
    /** Loop over meta tags */
    if (metaTags) {
        Object.keys(metaTags).map(function (key) {
            if (metaTagsValues[key]) {
                link += "&" + metaTags[key] + "=" + metaTagsValues[key];
            }
        });
    }
    return SharerURL + link;
});
/**
 * Print button operator
 */
var printOperator = operators.map(function (ref) { return ref.window.print(); });
/**
 * Pinterest operator - Since Pinterest requires the description and image meta tags,
 * this function checks if the meta tags are presented, if not it falls back to page meta tags
 * This should placed after the metaTagsOperator
 */
var pinterestOperator = operators.map(function (url) {
    if (!url.includes('&description')) {
        /**
         * If user didn't add description, get it from the OG meta tag
         */
        var /** @type {?} */ ogDescription = document.querySelector("meta[property=\"og:description\"]");
        if (ogDescription) {
            url += '&description=' + ogDescription.getAttribute('content');
        }
        else {
            console.warn("[ShareButtons]: You didn't set the description text for Pinterest button");
        }
    }
    if (!url.includes('&media')) {
        var /** @type {?} */ ogImage = document.querySelector("meta[property=\"og:image\"]");
        if (ogImage) {
            url += '&media=' + ogImage.getAttribute('content');
        }
        else {
            console.warn("[ShareButtons]: You didn't set the image URL for Pinterest button");
        }
    }
    return url;
});
/**
 * Copy button operator - to copy link to clipboard
 */
var copyOperators = [
    operators.map(function (ref) {
        /** Disable button click */
        ref.renderer.setStyle(ref.el, 'pointer-events', 'none');
        ref.temp = { text: ref.prop.text, icon: ref.prop.icon };
        var /** @type {?} */ link = decodeURIComponent(ref.url);
        /**
         * Create a hidden textarea element
         */
        var /** @type {?} */ textArea = ref.renderer.createElement('textarea');
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
    }, function (ref) {
        /** Set error text and icon on button */
        ref.prop.text = ref.prop.failText;
        ref.prop.icon = ref.prop.failIcon;
        ref.cd.markForCheck();
        console.warn('[ShareButtons]: Print button could not copy URL to clipboard');
    }),
    operators.delay(2000),
    operators.map(function (ref) {
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
var shareButtonsProp = {
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
                operators.map(function (res) { return +res.share.share_count; })
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
                operators.map(function (res) { return +res.count; })
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
                operators.map(function (text) { return JSON.parse(text.replace(/^receiveCount\((.*)\)/, '$1')); }),
                operators.map(function (res) { return +res.count; })
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
                operators.map(function (res) { return +res.data.children[0].data.score; })
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
                operators.map(function (res) { return +res.response.note_count; })
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
var ShareButtons = (function () {
    /**
     * @param {?} config
     */
    function ShareButtons(config) {
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
    Object.defineProperty(ShareButtons.prototype, "twitterAccount", {
        /**
         * @return {?}
         */
        get: function () {
            return this.options.twitterAccount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtons.prototype, "buttons", {
        /**
         * Get wanted buttons
         * @return {?}
         */
        get: function () {
            var _this = this;
            if (!this.options.exclude.length) {
                return this.options.include;
            }
            return this.options.include.filter(function (btn) { return _this.options.exclude.indexOf(btn) < 0; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtons.prototype, "theme", {
        /**
         * @return {?}
         */
        get: function () {
            return this.options.theme;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtons.prototype, "windowSize", {
        /**
         * @return {?}
         */
        get: function () {
            return "width=" + this.options.windowWidth + ", height=" + this.options.windowHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtons.prototype, "title", {
        /**
         * @return {?}
         */
        get: function () {
            return this.options.title;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtons.prototype, "description", {
        /**
         * @return {?}
         */
        get: function () {
            return this.options.description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtons.prototype, "image", {
        /**
         * @return {?}
         */
        get: function () {
            return this.options.image;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtons.prototype, "tags", {
        /**
         * @return {?}
         */
        get: function () {
            return this.options.tags;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtons.prototype, "gaTracking", {
        /**
         * @return {?}
         */
        get: function () {
            return this.options.gaTracking;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtons.prototype, "size", {
        /**
         * @return {?}
         */
        get: function () {
            return this.options.size;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} name
     * @param {?} data
     * @return {?}
     */
    ShareButtons.prototype.registerButton = function (name, data) {
        this.prop = Object.assign({}, shareButtonsProp, (_a = {}, _a[name] = data, _a));
        this.allButtons = Object.keys(this.prop);
        var _a;
    };
    return ShareButtons;
}());
ShareButtons.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
ShareButtons.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: core.Inject, args: [CONFIG,] },] },
]; };
/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 * @return {?}
 */
function getOS() {
    var /** @type {?} */ userAgent = navigator.userAgent || navigator.vendor || (window || global).opera;
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
function mergeDeep(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    if (!sources.length) {
        return target;
    }
    var /** @type {?} */ source = sources.shift();
    if (isObject(target) && isObject(source)) {
        for (var /** @type {?} */ key in source) {
            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, (_a = {}, _a[key] = {}, _a));
                }
                mergeDeep(target[key], source[key]);
            }
            else {
                Object.assign(target, (_b = {}, _b[key] = source[key], _b));
            }
        }
    }
    return mergeDeep.apply(void 0, [target].concat(sources));
    var _a, _b;
}
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var ShareButtonDirective = (function () {
    /**
     * @param {?} shareService
     * @param {?} http
     * @param {?} renderer
     * @param {?} cd
     * @param {?} el
     */
    function ShareButtonDirective(shareService, http$$1, renderer, cd, el) {
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
        this.sbCount = new core.EventEmitter();
        /**
         * Share dialog opened event
         */
        this.sbOpened = new core.EventEmitter();
        /**
         * Share dialog closed event
         */
        this.sbClosed = new core.EventEmitter();
        this.window = window || global;
    }
    Object.defineProperty(ShareButtonDirective.prototype, "setButton", {
        /**
         * Create share button
         * @param {?} buttonName
         * @return {?}
         */
        set: function (buttonName) {
            /**
             * Create a new button of type <buttonName>
             */
            var /** @type {?} */ button = Object.assign({}, this.shareService.prop[buttonName]);
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
                throw new Error("[ShareButtons]: The share button '" + buttonName + "' does not exist!");
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtonDirective.prototype, "sbUrl", {
        /**
         * Set share URL
         * @param {?} newUrl
         * @return {?}
         */
        set: function (newUrl) {
            /** Check if new URL is equal the current URL */
            if (newUrl !== this.url) {
                this.url = this.getValidURL(newUrl);
                this.emitCount();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Share link on element click
     * @return {?}
     */
    ShareButtonDirective.prototype.onClick = function () {
        var _this = this;
        /** Set user did not set the url using [sbUrl], use window URL */
        if (!this.url) {
            this.url = encodeURIComponent(this.window.location.href);
        }
        /** Emit opened share button type */
        this.sbOpened.emit(this.prop.type);
        var /** @type {?} */ ref = {
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
        (_a = of.of(ref)).pipe.apply(_a, this.prop.share.operators.concat([operators.tap(function (sharerURL) { return _this.share(sharerURL); }), operators.take(1)])).subscribe();
        var _a;
    };
    /**
     * Emit share count
     * @return {?}
     */
    ShareButtonDirective.prototype.emitCount = function () {
        var _this = this;
        /** Only if share count has observers & the button has support for share count */
        if (this.url && this.sbCount.observers.length && this.prop.count) {
            /** Emit share count to (sbCount) Output */
            this.count(this.url).subscribe(function (count) { return _this.sbCount.emit(count); });
        }
    };
    /**
     * Open sharing window
     * @param {?} url - Share URL
     * @return {?}
     */
    ShareButtonDirective.prototype.share = function (url) {
        var _this = this;
        var /** @type {?} */ popUp;
        if (url) {
            /** GA tracking */
            if (this.shareService.gaTracking && typeof ga !== 'undefined') {
                ga('send', 'social', this.prop.type, 'click', this.url);
            }
            popUp = this.window.open(url, 'newwindow', this.shareService.windowSize);
        }
        /** If dialog closed event has subscribers, emit closed dialog type */
        if (this.sbClosed.observers.length && popUp) {
            var /** @type {?} */ pollTimer_1 = this.window.setInterval(function () {
                if (popUp.closed) {
                    _this.window.clearInterval(pollTimer_1);
                    _this.sbClosed.emit(_this.prop.type);
                }
            }, 200);
        }
    };
    /**
     * Get link share count
     * @param {?} url - Share URL
     * @return {?} Share count
     */
    ShareButtonDirective.prototype.count = function (url) {
        if (this.prop.count.request === 'jsonp') {
            return (_a = this.http.jsonp(this.prop.count.url + url, 'callback')).pipe.apply(_a, this.prop.count.operators.concat([operators.catchError(function () { return empty.empty(); })]));
        }
        else {
            return (_b = this.http.get(this.prop.count.url + url, this.prop.count.args)).pipe.apply(_b, this.prop.count.operators.concat([operators.catchError(function () { return empty.empty(); })]));
        }
        var _a, _b;
    };
    /**
     * Get a valid URL for sharing
     * @param {?} url - URL to validate
     * @return {?} Sharable URL
     */
    ShareButtonDirective.prototype.getValidURL = function (url) {
        if (url) {
            var /** @type {?} */ r = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
            if (r.test(url)) {
                return encodeURIComponent(url);
            }
            console.warn("[ShareButtons]: Sharing link '" + url + "' is invalid!");
        }
        /** fallback to page current URL */
        return encodeURIComponent(this.window.location.href);
    };
    return ShareButtonDirective;
}());
ShareButtonDirective.decorators = [
    { type: core.Directive, args: [{
                selector: '[shareButton]'
            },] },
];
/** @nocollapse */
ShareButtonDirective.ctorParameters = function () { return [
    { type: ShareButtons, },
    { type: http.HttpClient, },
    { type: core.Renderer2, },
    { type: core.ChangeDetectorRef, },
    { type: core.ElementRef, },
]; };
ShareButtonDirective.propDecorators = {
    "sbTitle": [{ type: core.Input },],
    "sbDescription": [{ type: core.Input },],
    "sbImage": [{ type: core.Input },],
    "sbTags": [{ type: core.Input },],
    "setButton": [{ type: core.Input, args: ['shareButton',] },],
    "sbUrl": [{ type: core.Input },],
    "sbCount": [{ type: core.Output },],
    "sbOpened": [{ type: core.Output },],
    "sbClosed": [{ type: core.Output },],
    "onClick": [{ type: core.HostListener, args: ['click',] },],
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var NFormatterPipe = (function () {
    function NFormatterPipe() {
    }
    /**
     * @param {?} num
     * @param {?=} digits
     * @return {?}
     */
    NFormatterPipe.prototype.transform = function (num, digits) {
        if (typeof num !== 'number') {
            num = 1;
        }
        return nFormatter(num, digits);
    };
    return NFormatterPipe;
}());
NFormatterPipe.decorators = [
    { type: core.Pipe, args: [{
                name: 'nFormatter'
            },] },
];
/** @nocollapse */
NFormatterPipe.ctorParameters = function () { return []; };
/**
 * Change share counts to a readable number
 */
var nFormatter = function (num, digits) {
    var /** @type {?} */ si = [
        { value: 1E18, symbol: 'E' },
        { value: 1E15, symbol: 'P' },
        { value: 1E12, symbol: 'T' },
        { value: 1E9, symbol: 'G' },
        { value: 1E6, symbol: 'M' },
        { value: 1E3, symbol: 'K' }
    ], /** @type {?} */ rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    for (var /** @type {?} */ i = 0; i < si.length; i++) {
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
var ShareModule = (function () {
    function ShareModule() {
    }
    /**
     * @param {?=} config
     * @return {?}
     */
    ShareModule.forRoot = function (config) {
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
    };
    return ShareModule;
}());
ShareModule.decorators = [
    { type: core.NgModule, args: [{
                declarations: [
                    ShareButtonDirective,
                    NFormatterPipe
                ],
                imports: [
                    common.CommonModule
                ],
                exports: [
                    common.CommonModule,
                    ShareButtonDirective,
                    NFormatterPipe
                ]
            },] },
];
/** @nocollapse */
ShareModule.ctorParameters = function () { return []; };

exports.ShareButtonsFactory = ShareButtonsFactory;
exports.ShareModule = ShareModule;
exports.CONFIG = CONFIG;
exports.ShareButtons = ShareButtons;
exports.ShareButtonDirective = ShareButtonDirective;
exports.NFormatterPipe = NFormatterPipe;
exports.nFormatter = nFormatter;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-share-core.umd.js.map
