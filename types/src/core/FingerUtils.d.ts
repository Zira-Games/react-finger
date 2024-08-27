export declare type AnyFunction = (...args: any) => any;
export declare function isFunction(value: unknown): value is AnyFunction;
export declare type PointerPointLike = {
    pageX: number;
    pageY: number;
};
export declare function calcDistance(from: PointerPointLike, to: PointerPointLike): number;
export declare function calcCenter(pointer1: PointerPointLike, pointer2: PointerPointLike): PointerPointLike;
export declare function calcRotate(pointer1: PointerPointLike, pointer2: PointerPointLike): number;
export declare const isIPadPro: boolean;
export declare const isIOS: boolean;
