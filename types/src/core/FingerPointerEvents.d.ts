import { FingerPointer } from "./FingerContext";
import { HostElement, HostPointerEvent } from "./FingerHostEvents";
export declare type FingerPointerEventDetail<T> = {
    pointers: FingerPointer[];
    changedPointers: FingerPointer[];
} & T;
export declare type FingerPointerEvent<T extends HostElement = HostElement, D extends object = {}> = HostPointerEvent<T> & {
    hostEvent: HostPointerEvent<T>;
    fingerType: keyof FingerPointerEvents<T>;
    detail: FingerPointerEventDetail<D>;
} & FingerPointerEventDetail<D>;
export declare type FingerPointerEventListener<E extends FingerPointerEvent> = (event: E) => void;
export declare type FingerSwipeEvent<T extends HostElement = HostElement> = FingerPointerEvent<T, {
    direction: "up" | "right" | "down" | "left";
}>;
export declare type FingerPinchEvent<T extends HostElement = HostElement> = FingerPointerEvent<T, {
    centerX: number;
    centerY: number;
    scale: number;
    moveX: number;
    moveY: number;
    movementX: number;
    movementY: number;
    rotate: number;
}>;
export declare type FingerTapEvent<T extends HostElement = HostElement> = FingerPointerEvent<T, {}>;
export declare type FingerPointerEvents<T extends HostElement = HostElement> = {
    onFingerDown: FingerPointerEventListener<FingerPointerEvent<T>>;
    onFingerMove: FingerPointerEventListener<FingerPointerEvent<T>>;
    onFingerUp: FingerPointerEventListener<FingerPointerEvent<T>>;
    onFingerCancel: FingerPointerEventListener<FingerPointerEvent<T>>;
    onTap: FingerPointerEventListener<FingerTapEvent<T>>;
    onTapHold: FingerPointerEventListener<FingerTapEvent<T>>;
    onDoubleTap: FingerPointerEventListener<FingerTapEvent<T>>;
    onSwipe: FingerPointerEventListener<FingerSwipeEvent<T>>;
    onSwipeUp: FingerPointerEventListener<FingerSwipeEvent<T>>;
    onSwipeRight: FingerPointerEventListener<FingerSwipeEvent<T>>;
    onSwipeDown: FingerPointerEventListener<FingerSwipeEvent<T>>;
    onSwipeLeft: FingerPointerEventListener<FingerSwipeEvent<T>>;
    onPinchStart: FingerPointerEventListener<FingerPinchEvent<T>>;
    onPinch: FingerPointerEventListener<FingerPinchEvent<T>>;
    onPinchEnd: FingerPointerEventListener<FingerPinchEvent<T>>;
};
export declare function FingerPointerEvent<T extends HostElement, F extends keyof FingerPointerEvents<T>>(fingerType: F, hostEvent: HostPointerEvent<T>, detail: Parameters<FingerPointerEvents<T>[F]>[0]["detail"]): FingerPointerEvent<T, Parameters<FingerPointerEvents<T>[F]>[0]["detail"]>;
