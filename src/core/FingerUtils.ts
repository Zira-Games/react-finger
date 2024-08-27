/**
 * @homepage https://github.com/Houfeng/react-finger
 * @author Houfeng <houzhanfeng@gmail.com>
 */

export type AnyFunction = (...args: any) => any;

export function isFunction(value: unknown): value is AnyFunction {
  return typeof value === "function";
}

export type PointerPointLike = {
  pageX: number;
  pageY: number;
};

export function calcDistance(from: PointerPointLike, to: PointerPointLike) {
  if (!from || !to) return 0;
  const x = from.pageX - to.pageX;
  const y = from.pageY - to.pageY;
  return Math.sqrt(x * x + y * y);
}

export function calcCenter(
  pointer1: PointerPointLike,
  pointer2: PointerPointLike
): PointerPointLike {
  const maxX = Math.max(pointer1.pageX, pointer2.pageX);
  const minX = Math.min(pointer1.pageX, pointer2.pageX);
  const pageX = minX + (maxX - minX) / 2;
  const maxY = Math.max(pointer1.pageY, pointer2.pageY);
  const minY = Math.min(pointer1.pageY, pointer2.pageY);
  const pageY = minY + (maxY - minY) / 2;
  return { pageX, pageY };
}

export function calcRotate(
  pointer1: PointerPointLike,
  pointer2: PointerPointLike
) {
  const radians = Math.atan2(
    pointer2.pageY - pointer1.pageY,
    pointer2.pageX - pointer1.pageX
  );
  const degrees = radians * (180 / Math.PI);
  return degrees;
}

export const isIPadPro =
  typeof navigator !== "undefined" &&
  navigator.platform?.match("Mac") &&
  (navigator.maxTouchPoints || 0) > 1;

export const isIOS =
  (typeof navigator !== "undefined" &&
    /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) ||
  isIPadPro;
