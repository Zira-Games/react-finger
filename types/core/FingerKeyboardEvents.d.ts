import { HostElement, HostKeyboardEvent } from "./FingerHostEvents";
export declare type FingerKeyboardEventDetail<T> = T;
export declare type FingerKeyboardEvent<T extends HostElement = HostElement, D extends object = {}> = HostKeyboardEvent<T> & {
    hostEvent: HostKeyboardEvent<T>;
    fingerType: keyof FingerKeyboardEvents<T>;
    detail: FingerKeyboardEventDetail<D>;
} & FingerKeyboardEventDetail<D>;
export declare type FingerShortcutEvent<T extends HostElement = HostElement> = FingerKeyboardEvent<T, {
    keys: Set<string>;
    when: (matchKeys: string[], handler: (event?: HostKeyboardEvent<T>) => void) => void;
}>;
export declare type FingerKeyboardEventListener<E extends FingerKeyboardEvent> = (event: E) => void;
export declare type FingerKeyboardEvents<T extends HostElement = HostElement> = {
    onShortcut: FingerKeyboardEventListener<FingerShortcutEvent<T>>;
};
export declare function FingerKeyboardEvent<T extends HostElement, F extends keyof FingerKeyboardEvents<T>>(fingerType: F, hostEvent: HostKeyboardEvent<T>, detail: Parameters<FingerKeyboardEvents<T>[F]>[0]["detail"]): FingerKeyboardEvent<T, Parameters<FingerKeyboardEvents<T>[F]>[0]["detail"]>;
