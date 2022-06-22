/**
 * @homepage https://github.com/Houfeng/react-finger
 * @author Houfeng <houzhanfeng@gmail.com>
 */

import { clearEventTimer, createEventTimer } from "../core/FingerEventTimer";

import { FingerEvent } from "../core/FingerEvents";
import { FingerOptions } from "../core/FingerOptions";
import { FingerProvider } from "../core/FingerProviders";
import { calcDistance } from "../core/FingerUtils";

const { tapMaxDistanceThreshold, holdDurationThreshold, dblIntervalThreshold } =
  FingerOptions;

const holdTimer = Symbol("holdTimer");
const tapCanceled = Symbol("tapCanceled");
const dblWaitNext = Symbol("dblWaitNext");
const dblPrevTime = Symbol("dblPrevTime");

export const FingerTapProvider: FingerProvider = {
  handlePointerDown: ({ events, context, pointer }) => {
    const { flags, getPointers } = context;
    flags.set(tapCanceled, getPointers().length > 1);
    if (flags.get(tapCanceled)) {
      clearEventTimer(flags.get(holdTimer) as number);
    }
    flags.set(
      holdTimer,
      createEventTimer(() => {
        flags.set(tapCanceled, true);
        events.onTapHold?.(FingerEvent("onTapHold", context, pointer));
      }, holdDurationThreshold)
    );
  },

  handlePointerMove: ({ context }) => {
    const { flags, getPointers, getChangedPointers } = context;
    if (flags.get(tapCanceled)) return;
    const dist = calcDistance(getPointers()[0], getChangedPointers()[0]);
    if (dist > tapMaxDistanceThreshold) {
      flags.set(tapCanceled, true);
      clearEventTimer(flags.get(holdTimer) as number);
    }
  },

  handlePointerUp: ({ events, context, pointer }) => {
    const { flags } = context;
    clearEventTimer(flags.get(holdTimer) as number);
    if (flags.get(tapCanceled)) return;
    events.onTap?.(FingerEvent("onTap", context, pointer));
    const prevTime = (flags.get(dblPrevTime) || 0) as number;
    if (
      !flags.get(dblWaitNext) ||
      Date.now() - prevTime > dblIntervalThreshold
    ) {
      flags.set(dblPrevTime, Date.now());
      flags.set(dblWaitNext, true);
    } else {
      const prevTime = flags.get(dblPrevTime) as number;
      if (Date.now() - prevTime < dblIntervalThreshold) {
        events.onDoubleTap?.(FingerEvent("onDoubleTap", context, pointer));
      }
      flags.set(dblWaitNext, false);
    }
  },

  handlePointerCancel: ({ context }) => {
    const { flags } = context;
    flags.set(tapCanceled, true);
    clearEventTimer(flags.get(holdTimer) as number);
  },
};
