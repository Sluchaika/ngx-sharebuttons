import { ShareButtonRef } from './share.models';
import { Observable } from 'rxjs/Observable';
/**
 * None operator - just return the sharer URL
 */
export declare const noneOperator: (source: Observable<ShareButtonRef>) => Observable<string>;
/**
 * Meta tags operator - Serialize meta tags in the sharer URL
 */
export declare const metaTagsOperator: (source: Observable<ShareButtonRef>) => Observable<string>;
/**
 * Print button operator
 */
export declare const printOperator: (source: Observable<ShareButtonRef>) => Observable<void>;
/**
 * Pinterest operator - Since Pinterest requires the description and image meta tags,
 * this function checks if the meta tags are presented, if not it falls back to page meta tags
 * This should placed after the metaTagsOperator
 */
export declare const pinterestOperator: (source: Observable<string>) => Observable<string>;
/**
 * Copy button operator - to copy link to clipboard
 */
export declare const copyOperators: (((source: Observable<ShareButtonRef>) => Observable<void>) | ((source: Observable<{}>) => Observable<{}>))[];
