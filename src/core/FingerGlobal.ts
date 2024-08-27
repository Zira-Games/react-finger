/**
 * @homepage https://github.com/Houfeng/react-finger
 * @author Houfeng <houzhanfeng@gmail.com>
 */

import { clearAllEventTimers } from "./FingerEventTimer";
import { FingerOptions } from "./FingerOptions";
import { calcDistance } from "./FingerUtils";

export const FingerGlobal = {
  activePointersTotal: 0,
  primaryStartPoint: { pageX: 0, pageY: 0 },
  primaryEndPoint: { pageX: 0, pageY: 0 },
  get primaryMoveDistance() {
    const { primaryStartPoint, primaryEndPoint } = FingerGlobal;
    return calcDistance(primaryStartPoint, primaryEndPoint);
  },
};

function cleanGlobalEffects() {
  clearAllEventTimers();
}

function onPointerStart(event: PointerEvent) {
  FingerGlobal.activePointersTotal++;
  if (event.isPrimary) {
    const { pageX, pageY } = event;
    FingerGlobal.primaryStartPoint = { pageX, pageY };
    FingerGlobal.primaryEndPoint = { pageX, pageY };
  }
}

function onPointerMove(event: PointerEvent) {
  if (event.isPrimary && FingerGlobal.activePointersTotal > 0) {
    const { pageX, pageY } = event;
    FingerGlobal.primaryEndPoint = { pageX, pageY };
  }
}

function onPointerEnd(event: PointerEvent) {
  if (event.isPrimary) {
    const { pageX, pageY } = event;
    FingerGlobal.primaryEndPoint = { pageX, pageY };
  }
  FingerGlobal.activePointersTotal--;
  if (FingerGlobal.activePointersTotal < 1) {
    setTimeout(cleanGlobalEffects, FingerOptions.cleanGlobalEffectsThreshold);
  }
}

export function bindFingerGlobalEvents() {
  if (typeof document === "undefined") return;
  // unbind
  document.removeEventListener("pointerdown", onPointerStart, true);
  document.removeEventListener("pointermove", onPointerMove, true);
  document.removeEventListener("pointerup", onPointerEnd, true);
  document.removeEventListener("pointercancel", onPointerEnd, true);
  // bind
  document.addEventListener("pointerdown", onPointerStart, true);
  document.addEventListener("pointermove", onPointerMove, true);
  document.addEventListener("pointerup", onPointerEnd, true);
  document.addEventListener("pointercancel", onPointerEnd, true);
}

bindFingerGlobalEvents();
