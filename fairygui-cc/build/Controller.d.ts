import { ByteBuffer } from "./utils/ByteBuffer";
export declare class Controller extends EventTarget {
    private _selectedIndex;
    private _previousIndex;
    private _pageIds;
    private _pageNames;
    private _actions?;
    name: string;
    parent: GComponent;
    autoRadioGroupDepth?: boolean;
    changing?: boolean;
    constructor();
    dispose(): void;
    get selectedIndex(): number;
    set selectedIndex(value: number);
    onChanged<TFunction extends (...any: any[]) => void>(callback: TFunction, thisArg?: any): void;
    offChanged<TFunction extends (...any: any[]) => void>(callback: TFunction, thisArg?: any): void;
    setSelectedIndex(value: number): void;
    get previsousIndex(): number;
    get selectedPage(): string;
    set selectedPage(val: string);
    setSelectedPage(value: string): void;
    get previousPage(): string;
    get pageCount(): number;
    getPageName(index: number): string;
    addPage(name?: string): void;
    addPageAt(name?: string, index?: number): void;
    removePage(name: string): void;
    removePageAt(index: number): void;
    clearPages(): void;
    hasPage(aName: string): boolean;
    getPageIndexById(aId: string): number;
    getPageIdByName(aName: string): string | null;
    getPageNameById(aId: string): string | null;
    getPageId(index: number): string | null;
    get selectedPageId(): string | null;
    set selectedPageId(val: string | null);
    set oppositePageId(val: string | null);
    get previousPageId(): string | null;
    runActions(): void;
    setup(buffer: ByteBuffer): void;
}
import { EventTarget } from "cc";
import { GComponent } from "./GComponent";
