/**
 * @homepage https://github.com/Houfeng/react-finger
 * @author Houfeng <houzhanfeng@gmail.com>
 */

import { FingerOptions } from "../core/FingerOptions";
import { FingerPointerEvent } from "../core/FingerPointerEvents";
import { FingerProvider } from "../core/FingerProviders";

const { swipeMinDistanceThreshold, swipeMaxDurationThreshold } = FingerOptions;

const CANCELED = Symbol();
const START_TIME = Symbol();

const ALL_FLAGS = [CANCELED, START_TIME];

type SwipeDirection = "up" | "down" | "left" | "right";
type SwipeEventNames =
  | "onSwipeUp"
  | "onSwipeDown"
  | "onSwipeLeft"
  | "onSwipeRight";

const swipeDirectionToEventNames: Record<SwipeDirection, SwipeEventNames> = {
  down: "onSwipeDown",
  up: "onSwipeUp",
  right: "onSwipeRight",
  left: "onSwipeLeft",
};

export const FingerSwipeProvider: FingerProvider = {
  name: "Swipe",
  events: [
    "onSwipe",
    "onSwipeUp",
    "onSwipeDown",
    "onSwipeLeft",
    "onSwipeRight",
  ],

  handlePointerDown: ({ context, pointer }) => {
    pointer.target.setPointerCapture?.(pointer.pointerId);
    if (pointer.isPrimary) context.cleanFlags(ALL_FLAGS);
    const { flags, getPointers } = context;
    flags.set(CANCELED, getPointers().length > 1);
    flags.set(START_TIME, Date.now());
  },

  handlePointerWillUp: ({ events, context, pointer }) => {
    pointer.target.releasePointerCapture?.(pointer.pointerId);
    const { flags, getPointers, getChangedPointers } = context;
    const invalidTime =
      Date.now() - (flags.get(START_TIME) as number) >
      swipeMaxDurationThreshold;
    if (flags.get(CANCELED) || invalidTime) return;
    const pointers = getPointers();
    const changedPointers = getChangedPointers();
    const start = pointers[0];
    const end = changedPointers[0];
    const distX = end?.pageX - start?.pageX;
    const distY = end?.pageY - start?.pageY;
    const direction = ((): SwipeDirection => {
      if (
        Math.abs(distX) > Math.abs(distY) &&
        Math.abs(distX) > swipeMinDistanceThreshold
      ) {
        return distX > 0 ? "right" : "left";
      } else if (
        Math.abs(distX) < Math.abs(distY) &&
        Math.abs(distY) > swipeMinDistanceThreshold
      ) {
        return distY > 0 ? "down" : "up";
      }
    })();
    if (!direction) return;
    const detail = { pointers, changedPointers, direction };
    events.onSwipe?.(FingerPointerEvent("onSwipe", pointer, detail));
    const eventName = swipeDirectionToEventNames[direction];
    events[eventName]?.(FingerPointerEvent(eventName, pointer, detail));
  },

  handlePointerCancel: ({ context, pointer }) => {
    pointer.target.releasePointerCapture?.(pointer.pointerId);
    const { flags } = context;
    flags.set(CANCELED, true);
  },
};
