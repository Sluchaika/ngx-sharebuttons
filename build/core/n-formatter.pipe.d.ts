import { PipeTransform } from '@angular/core';
export declare class NFormatterPipe implements PipeTransform {
    transform(num: any, digits?: any): any;
}
/** Change share counts to a readable number */
export declare const nFormatter: (num: number, digits: number) => string;
