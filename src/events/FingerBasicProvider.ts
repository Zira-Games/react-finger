/**
 * @homepage https://github.com/Houfeng/react-finger
 * @author Houfeng <houzhanfeng@gmail.com>
 */

import { PointerPointLike } from "../core/FingerUtils";

import { FingerPointerEvent } from "../core/FingerPointerEvents";
import { FingerProvider } from "../core/FingerProviders";

const LATEST_POS = Symbol();

const ALL_FLAGS = [LATEST_POS];

export const FingerBasicProvider: FingerProvider = {
  name: "Basic",
  events: ["onFingerDown", "onFingerMove", "onFingerUp", "onFingerCancel"],

  handlePointerDown: ({ events, context, pointer }) => {
    if (pointer.isPrimary) context.cleanFlags(ALL_FLAGS);
    context.flags.delete(LATEST_POS);
    if (!events.onFingerDown) return;
    const { getPointers, getChangedPointers } = context;
    const pointers = getPointers();
    const changedPointers = getChangedPointers();
    const detail = { pointers, changedPointers };
    events.onFingerDown(FingerPointerEvent("onFingerDown", pointer, detail));
  },

  handlePointerMove: ({ events, context, pointer }) => {
    if (!events.onFingerMove) return;
    const { getPointers, getChangedPointers, flags } = context;
    const pointers = getPointers();
    const changedPointers = getChangedPointers();
    if (
      // isIOS &&
      pointer.pointerType !== "mouse" &&
      pointers.length === 1
      // !pointer.movementX &&
      // !pointer.movementY
    ) {
      // 让 ios 在上 pointerType !== 'mouse' 但仅单指时兼容 movementX/Y
      const { pageX, pageY } = pointer;
      const prev = (flags.get(LATEST_POS) || pointers[0]) as PointerPointLike;
      const movementX = pageX - prev.pageX;
      const movementY = pageY - prev.pageY;
      const detail = { pointers, changedPointers, movementX, movementY };
      events.onFingerMove(FingerPointerEvent("onFingerMove", pointer, detail));
      flags.set(LATEST_POS, { pageX, pageY });
    } else {
      const detail = { pointers, changedPointers };
      events.onFingerMove(FingerPointerEvent("onFingerMove", pointer, detail));
    }
  },

  handlePointerUp: ({ events, context, pointer }) => {
    context.flags.delete(LATEST_POS);
    if (!events.onFingerUp) return;
    const { getPointers, getChangedPointers } = context;
    const pointers = getPointers();
    const changedPointers = getChangedPointers();
    const detail = { pointers, changedPointers };
    events.onFingerUp(FingerPointerEvent("onFingerUp", pointer, detail));
  },

  handlePointerCancel: ({ events, context, pointer }) => {
    context.flags.delete(LATEST_POS);
    if (!events.onFingerCancel) return;
    const { getPointers, getChangedPointers } = context;
    const pointers = getPointers();
    const changedPointers = getChangedPointers();
    const detail = { pointers, changedPointers };
    events.onFingerCancel(
      FingerPointerEvent("onFingerCancel", pointer, detail)
    );
  },
};
