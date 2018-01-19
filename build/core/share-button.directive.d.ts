import { EventEmitter, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ShareButtons } from './share.service';
import { IShareButton } from './share.models';
export declare class ShareButtonDirective {
    private shareService;
    private http;
    renderer: Renderer2;
    cd: ChangeDetectorRef;
    private el;
    /** A ref for window object that works on SSR */
    window: Window;
    /** Button properties */
    prop: IShareButton;
    /** The validated share URL */
    url: string;
    /** Button class - used to remove previous class when the button type is changed */
    buttonClass: string;
    /** Meta tags inputs - initialized from the global options */
    sbTitle: string;
    sbDescription: string;
    sbImage: string;
    sbTags: string;
    /** Create share button  */
    setButton: string;
    /** Set share URL */
    sbUrl: string;
    /** Share count event */
    sbCount: EventEmitter<number>;
    /** Share dialog opened event */
    sbOpened: EventEmitter<string>;
    /** Share dialog closed event */
    sbClosed: EventEmitter<string>;
    constructor(shareService: ShareButtons, http: HttpClient, renderer: Renderer2, cd: ChangeDetectorRef, el: ElementRef);
    /**
     * Share link on element click
     */
    onClick(): void;
    /**
     * Emit share count
     */
    emitCount(): void;
    /**
     * Open sharing window
     * @param url - Share URL
     */
    share(url: string): void;
    /**
     * Get link share count
     * @param url - Share URL
     * @returns Share count
     */
    count(url: string): Observable<any>;
    /**
     * Get a valid URL for sharing
     * @param url - URL to validate
     * @returns Sharable URL
     */
    private getValidURL(url);
}
