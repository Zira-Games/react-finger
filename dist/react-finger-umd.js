(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ReactFinger = {}, global.React));
})(this, (function (exports, react) { 'use strict';

  var eventTimerOwner = new Set();
  function createEventTimer(fn, timeout) {
      var timer = setTimeout(function () {
          clearEventTimer(timer);
          fn();
      }, timeout);
      eventTimerOwner.add(timer);
      return timer;
  }
  function clearEventTimer(timer) {
      clearTimeout(timer);
      return eventTimerOwner.delete(timer);
  }
  function clearAllEventTimers() {
      Array.from(eventTimerOwner).forEach(function (timer) { return clearEventTimer(timer); });
  }

  var FingerOptions = {
      cleanGlobalEffectsThreshold: 100,
      swipeMaxDurationThreshold: 600,
      swipeMinDistanceThreshold: 25,
      tapMaxDistanceThreshold: 10,
      holdDurationThreshold: 600,
      dblIntervalThreshold: 500,
  };

  var _a;
  function isFunction(value) {
      return typeof value === "function";
  }
  function calcDistance(from, to) {
      if (!from || !to)
          return 0;
      var x = from.pageX - to.pageX;
      var y = from.pageY - to.pageY;
      return Math.sqrt(x * x + y * y);
  }
  function calcCenter(pointer1, pointer2) {
      var maxX = Math.max(pointer1.pageX, pointer2.pageX);
      var minX = Math.min(pointer1.pageX, pointer2.pageX);
      var pageX = minX + (maxX - minX) / 2;
      var maxY = Math.max(pointer1.pageY, pointer2.pageY);
      var minY = Math.min(pointer1.pageY, pointer2.pageY);
      var pageY = minY + (maxY - minY) / 2;
      return { pageX: pageX, pageY: pageY };
  }
  function calcRotate(pointer1, pointer2) {
      var radians = Math.atan2(pointer2.pageY - pointer1.pageY, pointer2.pageX - pointer1.pageX);
      var degrees = radians * (180 / Math.PI);
      return degrees;
  }
  var isIPadPro = typeof navigator !== "undefined" &&
      ((_a = navigator.platform) === null || _a === void 0 ? void 0 : _a.match("Mac")) &&
      (navigator.maxTouchPoints || 0) > 1;
  (typeof navigator !== "undefined" &&
      /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) ||
      isIPadPro;

  var FingerGlobal = {
      activePointersTotal: 0,
      primaryStartPoint: { pageX: 0, pageY: 0 },
      primaryEndPoint: { pageX: 0, pageY: 0 },
      get primaryMoveDistance() {
          var primaryStartPoint = FingerGlobal.primaryStartPoint, primaryEndPoint = FingerGlobal.primaryEndPoint;
          return calcDistance(primaryStartPoint, primaryEndPoint);
      },
  };
  function cleanGlobalEffects() {
      clearAllEventTimers();
  }
  function onPointerStart(event) {
      FingerGlobal.activePointersTotal++;
      if (event.isPrimary) {
          var pageX = event.pageX, pageY = event.pageY;
          FingerGlobal.primaryStartPoint = { pageX: pageX, pageY: pageY };
          FingerGlobal.primaryEndPoint = { pageX: pageX, pageY: pageY };
      }
  }
  function onPointerMove(event) {
      if (event.isPrimary && FingerGlobal.activePointersTotal > 0) {
          var pageX = event.pageX, pageY = event.pageY;
          FingerGlobal.primaryEndPoint = { pageX: pageX, pageY: pageY };
      }
  }
  function onPointerEnd(event) {
      if (event.isPrimary) {
          var pageX = event.pageX, pageY = event.pageY;
          FingerGlobal.primaryEndPoint = { pageX: pageX, pageY: pageY };
      }
      FingerGlobal.activePointersTotal--;
      if (FingerGlobal.activePointersTotal < 1) {
          setTimeout(cleanGlobalEffects, FingerOptions.cleanGlobalEffectsThreshold);
      }
  }
  function bindFingerGlobalEvents() {
      if (typeof document === "undefined")
          return;
      document.removeEventListener("pointerdown", onPointerStart, true);
      document.removeEventListener("pointermove", onPointerMove, true);
      document.removeEventListener("pointerup", onPointerEnd, true);
      document.removeEventListener("pointercancel", onPointerEnd, true);
      document.addEventListener("pointerdown", onPointerStart, true);
      document.addEventListener("pointermove", onPointerMove, true);
      document.addEventListener("pointerup", onPointerEnd, true);
      document.addEventListener("pointercancel", onPointerEnd, true);
  }
  bindFingerGlobalEvents();

  var providers$1 = new Set();
  var eventNames = new Set([
      "onPointerDown",
      "onPointerMove",
      "onPointerUp",
      "onPointerCancel",
      "onKeyDown",
      "onKeyUp",
      "onFocus",
      "onBlur",
  ]);
  function registerFingerProvider(provider) {
      providers$1.add(provider);
      provider.events.forEach(function (name) { return eventNames.add(name); });
  }
  function getAllFingerProviders() {
      return providers$1;
  }
  function getAllEventNames() {
      return eventNames;
  }

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };
  function __extends(d, b) {
      if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };
  function __rest(s, e) {
      var t = {};
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
              if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                  t[p[i]] = s[p[i]];
          }
      return t;
  }
  function __awaiter(thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  }
  function __generator(thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
      return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (g && (g = 0, op[0] && (_ = 0)), _) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  }
  function __spreadArray(to, from, pack) {
      if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
              if (!ar) ar = Array.prototype.slice.call(from, 0, i);
              ar[i] = from[i];
          }
      }
      return to.concat(ar || Array.prototype.slice.call(from));
  }
  typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
      var e = new Error(message);
      return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
  };

  var POINTER_EVENT_KEYS = [
      "nativeEvent",
      "pointerId",
      "width",
      "height",
      "pressure",
      "tiltX",
      "tiltY",
      "twist",
      "pointerType",
      "isPrimary",
      "screenX",
      "screenY",
      "clientX",
      "clientY",
      "ctrlKey",
      "shiftKey",
      "altKey",
      "metaKey",
      "button",
      "buttons",
      "pageX",
      "pageY",
      "offsetX",
      "offsetY",
      "movementX",
      "movementY",
      "type",
      "target",
      "currentTarget",
      "bubbles",
      "cancelable",
      "timeStamp",
      "cancelBubble",
      "composedPath",
      "preventDefault",
      "eventPhase",
      "isDefaultPrevented",
      "isPropagationStopped",
      "isTrusted",
      "defaultPrevented",
      "getModifierState",
      "location",
      "path",
      "view",
      "charCode",
      "code",
      "key",
      "keyCode",
      "which",
      "repeat",
  ];
  var EventWrapperPrototype = {
      stopImmediatePropagation: function () {
          var _a, _b;
          clearAllEventTimers();
          (_b = (_a = this.hostEvent) === null || _a === void 0 ? void 0 : _a.stopImmediatePropagation) === null || _b === void 0 ? void 0 : _b.call(_a);
      },
      stopPropagation: function () {
          var _a, _b;
          clearAllEventTimers();
          (_b = (_a = this.hostEvent) === null || _a === void 0 ? void 0 : _a.stopPropagation) === null || _b === void 0 ? void 0 : _b.call(_a);
      },
  };
  POINTER_EVENT_KEYS.forEach(function (key) {
      Object.defineProperty(EventWrapperPrototype, key, {
          get: function () {
              var value = this.hostEvent[key];
              return isFunction(value) ? value.bind(this.hostEvent) : value;
          },
      });
  });
  function createEventWrapper(hostEvent, fields) {
      var wrapper = fields ? fields : {};
      Object.setPrototypeOf(wrapper, EventWrapperPrototype);
      wrapper.hostEvent = hostEvent;
      return wrapper;
  }

  function FingerPointerEvent(fingerType, hostEvent, detail) {
      var _a;
      (_a = hostEvent.persist) === null || _a === void 0 ? void 0 : _a.call(hostEvent);
      var fingerEvent = createEventWrapper(hostEvent, __assign(__assign({}, detail), { fingerType: fingerType, detail: detail }));
      return fingerEvent;
  }

  var PINCHING = Symbol();
  var DETAIL = Symbol();
  var ORIGIN_DIST = Symbol();
  var ORIGIN_CENTER = Symbol();
  var LATEST_CENTER = Symbol();
  var ORIGIN_ROTATE = Symbol();
  var ALL_FLAGS$2 = [
      PINCHING,
      DETAIL,
      ORIGIN_DIST,
      ORIGIN_CENTER,
      LATEST_CENTER,
      ORIGIN_ROTATE,
  ];
  var FingerPinchProvider = {
      name: "Pinch",
      events: ["onPinchStart", "onPinch", "onPinchEnd"],
      handlePointerDown: function (_a) {
          var _b, _c, _d;
          var events = _a.events, context = _a.context, pointer = _a.pointer;
          (_c = (_b = pointer.target).setPointerCapture) === null || _c === void 0 ? void 0 : _c.call(_b, pointer.pointerId);
          if (pointer.isPrimary)
              context.cleanFlags(ALL_FLAGS$2);
          var flags = context.flags, getPointers = context.getPointers, getChangedPointers = context.getChangedPointers;
          var pointers = getPointers();
          var changedPointers = getChangedPointers();
          if (pointers.length > 1 && !flags.get(PINCHING)) {
              flags.set(PINCHING, true);
              var dist = calcDistance(pointers[0], pointers[1]);
              flags.set(ORIGIN_DIST, dist);
              var rotate = calcRotate(pointers[0], pointers[1]);
              flags.set(ORIGIN_ROTATE, rotate);
              var center = calcCenter(changedPointers[0], changedPointers[1]);
              flags.set(ORIGIN_CENTER, center);
              flags.set(LATEST_CENTER, center);
              var centerX = center.pageX;
              var centerY = center.pageY;
              var detail = {
                  pointers: pointers,
                  changedPointers: changedPointers,
                  centerX: centerX,
                  centerY: centerY,
                  scale: 1,
                  rotate: 0,
                  moveX: 0,
                  moveY: 0,
                  movementX: 0,
                  movementY: 0,
              };
              flags.set(DETAIL, detail);
              (_d = events.onPinchStart) === null || _d === void 0 ? void 0 : _d.call(events, FingerPointerEvent("onPinchStart", pointer, detail));
          }
      },
      handlePointerMove: function (_a) {
          var _b;
          var events = _a.events, context = _a.context, pointer = _a.pointer;
          var flags = context.flags, getPointers = context.getPointers, getChangedPointers = context.getChangedPointers;
          var pointers = getPointers();
          var changedPointers = getChangedPointers();
          if (pointers.length < 2 || !flags.get(PINCHING))
              return;
          var originDist = flags.get(ORIGIN_DIST);
          var latestDist = calcDistance(changedPointers[0], changedPointers[1]);
          var scale = latestDist / originDist;
          var originCenter = flags.get(ORIGIN_CENTER);
          var prevCenter = flags.get(LATEST_CENTER);
          var latestCenter = calcCenter(changedPointers[0], changedPointers[1]);
          flags.set(LATEST_CENTER, latestCenter);
          var centerX = latestCenter.pageX;
          var centerY = latestCenter.pageY;
          var moveX = latestCenter.pageX - originCenter.pageX;
          var moveY = latestCenter.pageY - originCenter.pageY;
          var movementX = latestCenter.pageX - prevCenter.pageX;
          var movementY = latestCenter.pageY - prevCenter.pageY;
          var originRotate = flags.get(ORIGIN_ROTATE);
          var latestRotate = calcRotate(changedPointers[0], changedPointers[1]);
          var rotate = latestRotate - originRotate;
          var detail = {
              pointers: pointers,
              changedPointers: changedPointers,
              centerX: centerX,
              centerY: centerY,
              scale: scale,
              moveX: moveX,
              moveY: moveY,
              movementX: movementX,
              movementY: movementY,
              rotate: rotate,
          };
          flags.set(DETAIL, detail);
          (_b = events.onPinch) === null || _b === void 0 ? void 0 : _b.call(events, FingerPointerEvent("onPinch", pointer, detail));
      },
      handlePointerWillUp: function (_a) {
          var _b, _c, _d;
          var events = _a.events, context = _a.context, pointer = _a.pointer;
          (_c = (_b = pointer.target).releasePointerCapture) === null || _c === void 0 ? void 0 : _c.call(_b, pointer.pointerId);
          var flags = context.flags, getPointers = context.getPointers;
          var pointers = getPointers();
          if (pointers.length === 2 && flags.get(PINCHING)) {
              flags.set(PINCHING, false);
              var detail = flags.get(DETAIL);
              (_d = events.onPinchEnd) === null || _d === void 0 ? void 0 : _d.call(events, FingerPointerEvent("onPinchEnd", pointer, detail));
          }
      },
      handlePointerWillCancel: function (_a) {
          var _b, _c, _d;
          var events = _a.events, context = _a.context, pointer = _a.pointer;
          (_c = (_b = pointer.target).releasePointerCapture) === null || _c === void 0 ? void 0 : _c.call(_b, pointer.pointerId);
          var flags = context.flags, getPointers = context.getPointers;
          var pointers = getPointers();
          if (pointers.length === 2 && flags.get(PINCHING)) {
              flags.set(PINCHING, false);
              var detail = flags.get(DETAIL);
              (_d = events.onPinchEnd) === null || _d === void 0 ? void 0 : _d.call(events, FingerPointerEvent("onPinchEnd", pointer, detail));
          }
      },
  };

  var LATEST_POS = Symbol();
  var ALL_FLAGS$1 = [LATEST_POS];
  var FingerBasicProvider = {
      name: "Basic",
      events: ["onFingerDown", "onFingerMove", "onFingerUp", "onFingerCancel"],
      handlePointerDown: function (_a) {
          var events = _a.events, context = _a.context, pointer = _a.pointer;
          if (pointer.isPrimary)
              context.cleanFlags(ALL_FLAGS$1);
          context.flags.delete(LATEST_POS);
          if (!events.onFingerDown)
              return;
          var getPointers = context.getPointers, getChangedPointers = context.getChangedPointers;
          var pointers = getPointers();
          var changedPointers = getChangedPointers();
          var detail = { pointers: pointers, changedPointers: changedPointers };
          events.onFingerDown(FingerPointerEvent("onFingerDown", pointer, detail));
      },
      handlePointerMove: function (_a) {
          var events = _a.events, context = _a.context, pointer = _a.pointer;
          if (!events.onFingerMove)
              return;
          var getPointers = context.getPointers, getChangedPointers = context.getChangedPointers, flags = context.flags;
          var pointers = getPointers();
          var changedPointers = getChangedPointers();
          if (pointer.pointerType !== "mouse" &&
              pointers.length === 1) {
              var pageX = pointer.pageX, pageY = pointer.pageY;
              var prev = (flags.get(LATEST_POS) || pointers[0]);
              var movementX = pageX - prev.pageX;
              var movementY = pageY - prev.pageY;
              var detail = { pointers: pointers, changedPointers: changedPointers, movementX: movementX, movementY: movementY };
              events.onFingerMove(FingerPointerEvent("onFingerMove", pointer, detail));
              flags.set(LATEST_POS, { pageX: pageX, pageY: pageY });
          }
          else {
              var detail = { pointers: pointers, changedPointers: changedPointers };
              events.onFingerMove(FingerPointerEvent("onFingerMove", pointer, detail));
          }
      },
      handlePointerUp: function (_a) {
          var events = _a.events, context = _a.context, pointer = _a.pointer;
          context.flags.delete(LATEST_POS);
          if (!events.onFingerUp)
              return;
          var getPointers = context.getPointers, getChangedPointers = context.getChangedPointers;
          var pointers = getPointers();
          var changedPointers = getChangedPointers();
          var detail = { pointers: pointers, changedPointers: changedPointers };
          events.onFingerUp(FingerPointerEvent("onFingerUp", pointer, detail));
      },
      handlePointerCancel: function (_a) {
          var events = _a.events, context = _a.context, pointer = _a.pointer;
          context.flags.delete(LATEST_POS);
          if (!events.onFingerCancel)
              return;
          var getPointers = context.getPointers, getChangedPointers = context.getChangedPointers;
          var pointers = getPointers();
          var changedPointers = getChangedPointers();
          var detail = { pointers: pointers, changedPointers: changedPointers };
          events.onFingerCancel(FingerPointerEvent("onFingerCancel", pointer, detail));
      },
  };

  var swipeMinDistanceThreshold = FingerOptions.swipeMinDistanceThreshold, swipeMaxDurationThreshold = FingerOptions.swipeMaxDurationThreshold;
  var CANCELED$1 = Symbol();
  var START_TIME = Symbol();
  var ALL_FLAGS = [CANCELED$1, START_TIME];
  var swipeDirectionToEventNames = {
      down: "onSwipeDown",
      up: "onSwipeUp",
      right: "onSwipeRight",
      left: "onSwipeLeft",
  };
  var FingerSwipeProvider = {
      name: "Swipe",
      events: [
          "onSwipe",
          "onSwipeUp",
          "onSwipeDown",
          "onSwipeLeft",
          "onSwipeRight",
      ],
      handlePointerDown: function (_a) {
          var _b, _c;
          var context = _a.context, pointer = _a.pointer;
          (_c = (_b = pointer.target).setPointerCapture) === null || _c === void 0 ? void 0 : _c.call(_b, pointer.pointerId);
          if (pointer.isPrimary)
              context.cleanFlags(ALL_FLAGS);
          var flags = context.flags, getPointers = context.getPointers;
          flags.set(CANCELED$1, getPointers().length > 1);
          flags.set(START_TIME, Date.now());
      },
      handlePointerWillUp: function (_a) {
          var _b, _c, _d, _e;
          var events = _a.events, context = _a.context, pointer = _a.pointer;
          (_c = (_b = pointer.target).releasePointerCapture) === null || _c === void 0 ? void 0 : _c.call(_b, pointer.pointerId);
          var flags = context.flags, getPointers = context.getPointers, getChangedPointers = context.getChangedPointers;
          var invalidTime = Date.now() - flags.get(START_TIME) >
              swipeMaxDurationThreshold;
          if (flags.get(CANCELED$1) || invalidTime)
              return;
          var pointers = getPointers();
          var changedPointers = getChangedPointers();
          var start = pointers[0];
          var end = changedPointers[0];
          var distX = (end === null || end === void 0 ? void 0 : end.pageX) - (start === null || start === void 0 ? void 0 : start.pageX);
          var distY = (end === null || end === void 0 ? void 0 : end.pageY) - (start === null || start === void 0 ? void 0 : start.pageY);
          var direction = (function () {
              if (Math.abs(distX) > Math.abs(distY) &&
                  Math.abs(distX) > swipeMinDistanceThreshold) {
                  return distX > 0 ? "right" : "left";
              }
              else if (Math.abs(distX) < Math.abs(distY) &&
                  Math.abs(distY) > swipeMinDistanceThreshold) {
                  return distY > 0 ? "down" : "up";
              }
          })();
          if (!direction)
              return;
          var detail = { pointers: pointers, changedPointers: changedPointers, direction: direction };
          (_d = events.onSwipe) === null || _d === void 0 ? void 0 : _d.call(events, FingerPointerEvent("onSwipe", pointer, detail));
          var eventName = swipeDirectionToEventNames[direction];
          (_e = events[eventName]) === null || _e === void 0 ? void 0 : _e.call(events, FingerPointerEvent(eventName, pointer, detail));
      },
      handlePointerCancel: function (_a) {
          var _b, _c;
          var context = _a.context, pointer = _a.pointer;
          (_c = (_b = pointer.target).releasePointerCapture) === null || _c === void 0 ? void 0 : _c.call(_b, pointer.pointerId);
          var flags = context.flags;
          flags.set(CANCELED$1, true);
      },
  };

  var tapMaxDistanceThreshold = FingerOptions.tapMaxDistanceThreshold, holdDurationThreshold = FingerOptions.holdDurationThreshold, dblIntervalThreshold = FingerOptions.dblIntervalThreshold;
  var HOLD_TIMER = Symbol();
  var CANCELED = Symbol();
  var DBL_WAIT_NEXT = Symbol();
  var DBL_PREV_TIME = Symbol();
  var DBL_PREV_POINTER = Symbol();
  var FingerTapProvider = {
      name: "Tap",
      events: ["onTap", "onTapHold", "onDoubleTap"],
      handlePointerDown: function (_a) {
          var _b, _c;
          var events = _a.events, context = _a.context, pointer = _a.pointer;
          if (pointer.isPrimary)
              context.cleanTimers();
          var flags = context.flags, getPointers = context.getPointers, getChangedPointers = context.getChangedPointers;
          var pointers = getPointers();
          var changedPointers = getChangedPointers();
          flags.set(CANCELED, pointers.length > 1);
          if (flags.get(CANCELED)) {
              return clearEventTimer(flags.get(HOLD_TIMER));
          }
          (_c = (_b = pointer.target).setPointerCapture) === null || _c === void 0 ? void 0 : _c.call(_b, pointer.pointerId);
          var detail = { pointers: pointers, changedPointers: changedPointers };
          flags.set(HOLD_TIMER, createEventTimer(function () {
              var _a;
              if (flags.get(CANCELED))
                  return;
              if (FingerGlobal.activePointersTotal !== 1)
                  return;
              if (FingerGlobal.primaryMoveDistance > tapMaxDistanceThreshold)
                  return;
              context.clean();
              flags.set(CANCELED, true);
              (_a = events.onTapHold) === null || _a === void 0 ? void 0 : _a.call(events, FingerPointerEvent("onTapHold", pointer, detail));
          }, holdDurationThreshold));
      },
      handlePointerMove: function (_a) {
          var context = _a.context;
          var flags = context.flags, getPointers = context.getPointers, getChangedPointers = context.getChangedPointers;
          if (flags.get(CANCELED))
              return;
          var pointers = getPointers();
          var changedPointers = getChangedPointers();
          var dist = calcDistance(pointers[0], changedPointers[0]);
          if (dist > tapMaxDistanceThreshold) {
              flags.set(CANCELED, true);
              clearEventTimer(flags.get(HOLD_TIMER));
          }
      },
      handlePointerWillUp: function (_a) {
          var _b, _c, _d, _e;
          var events = _a.events, context = _a.context, pointer = _a.pointer;
          var flags = context.flags, getPointers = context.getPointers, getChangedPointers = context.getChangedPointers;
          clearEventTimer(flags.get(HOLD_TIMER));
          if (flags.get(CANCELED))
              return;
          (_c = (_b = pointer.target).releasePointerCapture) === null || _c === void 0 ? void 0 : _c.call(_b, pointer.pointerId);
          var pointers = getPointers();
          var changedPointers = getChangedPointers();
          var detail = { pointers: pointers, changedPointers: changedPointers };
          (_d = events.onTap) === null || _d === void 0 ? void 0 : _d.call(events, FingerPointerEvent("onTap", pointer, detail));
          var prevTime = (flags.get(DBL_PREV_TIME) || 0);
          var timeOut = Date.now() - prevTime > dblIntervalThreshold;
          var prevPointer = flags.get(DBL_PREV_POINTER);
          var dist = prevPointer && calcDistance(prevPointer, changedPointers[0]);
          var distOut = (dist && dist > tapMaxDistanceThreshold) ||
              FingerGlobal.primaryMoveDistance > tapMaxDistanceThreshold;
          if (!flags.get(DBL_WAIT_NEXT) || timeOut || distOut) {
              flags.set(DBL_PREV_TIME, Date.now());
              flags.set(DBL_PREV_POINTER, changedPointers[0]);
              flags.set(DBL_WAIT_NEXT, true);
          }
          else {
              if (!timeOut && !distOut) {
                  (_e = events.onDoubleTap) === null || _e === void 0 ? void 0 : _e.call(events, FingerPointerEvent("onDoubleTap", pointer, detail));
              }
              flags.set(DBL_WAIT_NEXT, false);
          }
      },
      handlePointerCancel: function (_a) {
          var _b, _c;
          var context = _a.context, pointer = _a.pointer;
          (_c = (_b = pointer.target).releasePointerCapture) === null || _c === void 0 ? void 0 : _c.call(_b, pointer.pointerId);
          var flags = context.flags;
          flags.set(CANCELED, true);
          clearEventTimer(flags.get(HOLD_TIMER));
      },
  };

  function FingerKeyboardEvent(fingerType, hostEvent, detail) {
      var _a;
      (_a = hostEvent.persist) === null || _a === void 0 ? void 0 : _a.call(hostEvent);
      var fingerEvent = createEventWrapper(hostEvent, __assign(__assign({}, detail), { fingerType: fingerType, detail: detail }));
      return fingerEvent;
  }

  var LAST_ACTION_IS_DOWN = Symbol();
  function isMatched(keys, matchKeys) {
      return (keys &&
          matchKeys &&
          matchKeys.length === keys.size &&
          matchKeys.every(function (key) { return keys.has(key.toLowerCase()); }));
  }
  var FingerShortcutProvider = {
      name: "Shortcut",
      events: ["onShortcut"],
      handleKeyDown: function (_a) {
          var _b;
          var events = _a.events, context = _a.context, event = _a.event;
          var flags = context.flags;
          if (!event.repeat)
              flags.set(LAST_ACTION_IS_DOWN, true);
          if (!flags.get(LAST_ACTION_IS_DOWN))
              return;
          var keys = new Set();
          if (event.ctrlKey)
              keys.add("control");
          if (event.metaKey)
              keys.add("meta");
          if (event.shiftKey)
              keys.add("shift");
          if (event.altKey)
              keys.add("alt");
          keys.add(event.key.toLowerCase());
          var when = function (matchKeys, handler) {
              return isMatched(keys, matchKeys) && handler(event);
          };
          var detail = { when: when, keys: keys };
          var shortcutEvent = FingerKeyboardEvent("onShortcut", event, detail);
          (_b = events.onShortcut) === null || _b === void 0 ? void 0 : _b.call(events, shortcutEvent);
      },
      handleKeyUp: function (_a) {
          var context = _a.context;
          return context.flags.delete(LAST_ACTION_IS_DOWN);
      },
  };

  function createFingerPointer(hostEvent) {
      return createEventWrapper(hostEvent);
  }
  function FingerContext() {
      var flags = new Map();
      var pointers = new Map();
      var changedPointers = new Map();
      var addPointer = function (pointer) {
          pointers.set(pointer.pointerId, createFingerPointer(pointer));
          updatePointer(pointer);
      };
      var updatePointer = function (pointer) {
          changedPointers.set(pointer.pointerId, createFingerPointer(pointer));
      };
      var removePointer = function (pointer) {
          pointers.delete(pointer.pointerId);
          changedPointers.delete(pointer.pointerId);
      };
      var getPointers = function () {
          return Array.from(pointers.values());
      };
      var getChangedPointers = function () {
          return Array.from(changedPointers.values());
      };
      var cleanTimers = function () { return clearAllEventTimers(); };
      var cleanPointers = function () {
          pointers.clear();
          changedPointers.clear();
      };
      var cleanFlags = function (flagKeys) {
          if (!flagKeys || flagKeys.length < 1)
              return flags.clear();
          flagKeys.forEach(function (key) { return flags.delete(key); });
      };
      var clean = function () {
          cleanTimers();
          cleanPointers();
          cleanFlags();
      };
      return {
          addPointer: addPointer,
          updatePointer: updatePointer,
          removePointer: removePointer,
          getPointers: getPointers,
          getChangedPointers: getChangedPointers,
          flags: flags,
          cleanTimers: cleanTimers,
          cleanPointers: cleanPointers,
          cleanFlags: cleanFlags,
          clean: clean,
      };
  }

  var providers = getAllFingerProviders();
  function shouldTrigger(provider, events) {
      return provider.events.some(function (it) { return !!events[it]; });
  }
  function createPointerDownListener(events, context) {
      return function (pointer) {
          var _a;
          if (pointer.isPrimary)
              context.cleanPointers();
          (_a = events.onPointerDown) === null || _a === void 0 ? void 0 : _a.call(events, pointer);
          providers.forEach(function (it) {
              var _a;
              return shouldTrigger(it, events) &&
                  ((_a = it.handlePointerWillDown) === null || _a === void 0 ? void 0 : _a.call(it, { events: events, context: context, pointer: pointer }));
          });
          context.addPointer(pointer);
          providers.forEach(function (it) {
              var _a;
              return shouldTrigger(it, events) &&
                  ((_a = it.handlePointerDown) === null || _a === void 0 ? void 0 : _a.call(it, { events: events, context: context, pointer: pointer }));
          });
      };
  }
  function createPointerMoveListener(events, context) {
      return function (pointer) {
          var _a;
          (_a = events.onPointerMove) === null || _a === void 0 ? void 0 : _a.call(events, pointer);
          if (context.getPointers().length < 1)
              return;
          providers.forEach(function (it) {
              var _a;
              return shouldTrigger(it, events) &&
                  ((_a = it.handlePointerWillMove) === null || _a === void 0 ? void 0 : _a.call(it, { events: events, context: context, pointer: pointer }));
          });
          context.updatePointer(pointer);
          providers.forEach(function (it) {
              var _a;
              return shouldTrigger(it, events) &&
                  ((_a = it.handlePointerMove) === null || _a === void 0 ? void 0 : _a.call(it, { events: events, context: context, pointer: pointer }));
          });
      };
  }
  function createPointerUpListener(events, context) {
      return function (pointer) {
          var _a;
          (_a = events.onPointerUp) === null || _a === void 0 ? void 0 : _a.call(events, pointer);
          providers.forEach(function (it) {
              var _a;
              return shouldTrigger(it, events) &&
                  ((_a = it.handlePointerWillUp) === null || _a === void 0 ? void 0 : _a.call(it, { events: events, context: context, pointer: pointer }));
          });
          context.removePointer(pointer);
          providers.forEach(function (it) {
              var _a;
              return shouldTrigger(it, events) &&
                  ((_a = it.handlePointerUp) === null || _a === void 0 ? void 0 : _a.call(it, { events: events, context: context, pointer: pointer }));
          });
      };
  }
  function createPointerCancelListener(events, context) {
      return function (pointer) {
          var _a;
          (_a = events.onPointerCancel) === null || _a === void 0 ? void 0 : _a.call(events, pointer);
          providers.forEach(function (it) {
              var _a;
              return shouldTrigger(it, events) &&
                  ((_a = it.handlePointerWillCancel) === null || _a === void 0 ? void 0 : _a.call(it, { events: events, context: context, pointer: pointer }));
          });
          context.removePointer(pointer);
          providers.forEach(function (it) {
              var _a;
              return shouldTrigger(it, events) &&
                  ((_a = it.handlePointerCancel) === null || _a === void 0 ? void 0 : _a.call(it, { events: events, context: context, pointer: pointer }));
          });
      };
  }
  function createKeyDownListener(events, context) {
      return function (event) {
          var _a;
          (_a = events.onKeyDown) === null || _a === void 0 ? void 0 : _a.call(events, event);
          providers.forEach(function (it) {
              var _a;
              return shouldTrigger(it, events) &&
                  ((_a = it.handleKeyDown) === null || _a === void 0 ? void 0 : _a.call(it, { events: events, context: context, event: event }));
          });
      };
  }
  function createKeyUpListener(events, context) {
      return function (event) {
          var _a;
          (_a = events.onKeyUp) === null || _a === void 0 ? void 0 : _a.call(events, event);
          providers.forEach(function (it) {
              var _a;
              return shouldTrigger(it, events) &&
                  ((_a = it.handleKeyUp) === null || _a === void 0 ? void 0 : _a.call(it, { events: events, context: context, event: event }));
          });
      };
  }
  function createFocusListener(events, context) {
      return function (event) {
          var _a;
          (_a = events.onFocus) === null || _a === void 0 ? void 0 : _a.call(events, event);
          providers.forEach(function (it) {
              var _a;
              return shouldTrigger(it, events) &&
                  ((_a = it.handleFocus) === null || _a === void 0 ? void 0 : _a.call(it, { events: events, context: context, event: event }));
          });
      };
  }
  function createBlurListener(events, context) {
      return function (event) {
          var _a;
          (_a = events.onBlur) === null || _a === void 0 ? void 0 : _a.call(events, event);
          providers.forEach(function (it) { var _a; return shouldTrigger(it, events) && ((_a = it.handleBlur) === null || _a === void 0 ? void 0 : _a.call(it, { events: events, context: context, event: event })); });
      };
  }
  function composeFingerEvents(events) {
      var context = FingerContext();
      var onPointerDown = createPointerDownListener(events, context);
      var onPointerMove = createPointerMoveListener(events, context);
      var onPointerUp = createPointerUpListener(events, context);
      var onPointerCancel = createPointerCancelListener(events, context);
      var onKeyDown = createKeyDownListener(events, context);
      var onKeyUp = createKeyUpListener(events, context);
      var onFocus = createFocusListener(events, context);
      var onBlur = createBlurListener(events, context);
      return {
          onPointerDown: onPointerDown,
          onPointerMove: onPointerMove,
          onPointerUp: onPointerUp,
          onPointerCancel: onPointerCancel,
          onKeyDown: onKeyDown,
          onKeyUp: onKeyUp,
          onFocus: onFocus,
          onBlur: onBlur,
      };
  }

  function createFingerEvents(events) {
      return composeFingerEvents(events);
  }

  function useFingerEvents(events) {
      var eventsRef = react.useMemo(function () { return ({}); }, []);
      react.useLayoutEffect(function () {
          if (events)
              Object.assign(eventsRef, events);
      });
      return react.useMemo(function () { return composeFingerEvents(eventsRef); }, []);
  }

  function splitProps(props) {
      var eventNames = getAllEventNames();
      var eventProps = {};
      var otherProps = {};
      Object.entries(props).forEach(function (_a) {
          var key = _a[0], value = _a[1];
          if (eventNames.has(key))
              eventProps[key] = value;
          else
              otherProps[key] = value;
      });
      return { eventProps: eventProps, otherProps: otherProps };
  }

  var FingerCache = new Map();
  function Finger(type) {
      if (FingerCache.has(type))
          return FingerCache.get(type);
      var FC = react.forwardRef(function FingerComponent(props, ref) {
          var _a = splitProps(props), eventProps = _a.eventProps, otherProps = _a.otherProps;
          var events = useFingerEvents(eventProps);
          return react.createElement(type, __assign(__assign(__assign({}, otherProps), events), { ref: ref }));
      });
      FingerCache.set(type, FC);
      return FC;
  }

  var AbstractEventEmitter = (function () {
      function AbstractEventEmitter(options) {
          var _a = __assign({}, options), _b = _a.maxListeners, maxListeners = _b === void 0 ? 1024 : _b, _c = _a.requireLoopRemove, requireLoopRemove = _c === void 0 ? false : _c;
          this.__maxListeners = maxListeners;
          this.__listeners = {};
          this.__requireLoopRemove = requireLoopRemove;
      }
      AbstractEventEmitter.prototype.addListener = function (name, listener) {
          this.__listeners[name] = this.__listeners[name] || [];
          this.__listeners[name].push(listener);
          var maxListeners = this.__maxListeners;
          if (this.__listeners[name].length > maxListeners) {
              var error = "The '".concat(name, "' listener is not more than ").concat(maxListeners);
              console.warn(error, this);
          }
      };
      AbstractEventEmitter.prototype.on = function (name, listener) {
          return this.addListener(name, listener);
      };
      AbstractEventEmitter.prototype.removeListener = function (name, listener) {
          if (!this.__listeners[name] || !listener)
              return;
          this.__listeners[name] = this.__listeners[name].filter(function (it) { return it !== listener; });
      };
      AbstractEventEmitter.prototype.off = function (name, listener) {
          return this.removeListener(name, listener);
      };
      AbstractEventEmitter.prototype.removeAllListener = function (name) {
          var _this = this;
          if (name) {
              if (this.__requireLoopRemove && this.__listeners[name]) {
                  this.__listeners[name].slice(0).forEach(function (it) {
                      _this.removeListener(name, it);
                  });
              }
              this.__listeners[name] = [];
          }
          else {
              if (this.__requireLoopRemove) {
                  Object.keys(this.__listeners).forEach(function (it) {
                      _this.removeAllListener(it);
                  });
              }
              this.__listeners = {};
          }
      };
      AbstractEventEmitter.prototype.emit = function (name) {
          var _this = this;
          var args = [];
          for (var _i = 1; _i < arguments.length; _i++) {
              args[_i - 1] = arguments[_i];
          }
          if (!this.__listeners[name])
              return;
          var listeners = this.__listeners[name].slice(0);
          return listeners.map(function (it) { return it.call.apply(it, __spreadArray([_this], args, false)); });
      };
      AbstractEventEmitter.prototype.emitSerial = function (name) {
          var _this = this;
          var args = [];
          for (var _i = 1; _i < arguments.length; _i++) {
              args[_i - 1] = arguments[_i];
          }
          if (!this.__listeners[name])
              return;
          var listeners = this.__listeners[name].slice(0);
          return listeners.reduce(function (result, it) { return __awaiter(_this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0: return [4, result];
                      case 1:
                          if ((_a.sent()) === false)
                              return [2, false];
                          return [2, it.call.apply(it, __spreadArray([this], args, false))];
                  }
              });
          }); }, true);
      };
      AbstractEventEmitter.prototype.emitParallel = function (name) {
          var _this = this;
          var args = [];
          for (var _i = 1; _i < arguments.length; _i++) {
              args[_i - 1] = arguments[_i];
          }
          if (!this.__listeners[name])
              return;
          var listeners = this.__listeners[name].slice(0);
          return Promise.all(listeners.map(function (it) { return it.call.apply(it, __spreadArray([_this], args, false)); }));
      };
      AbstractEventEmitter.prototype.emitAsync = function (name) {
          var args = [];
          for (var _i = 1; _i < arguments.length; _i++) {
              args[_i - 1] = arguments[_i];
          }
          return this.emitParallel.apply(this, __spreadArray([name], args, false));
      };
      return AbstractEventEmitter;
  }());

  var EventEmitter = (function (_super) {
      __extends(EventEmitter, _super);
      function EventEmitter(options) {
          return _super.call(this, options) || this;
      }
      EventEmitter.prototype.emit = function (name) {
          var args = [];
          for (var _i = 1; _i < arguments.length; _i++) {
              args[_i - 1] = arguments[_i];
          }
          return _super.prototype.emit.apply(this, __spreadArray([name], args, false));
      };
      EventEmitter.prototype.emitSerial = function (name) {
          var args = [];
          for (var _i = 1; _i < arguments.length; _i++) {
              args[_i - 1] = arguments[_i];
          }
          return _super.prototype.emitSerial.apply(this, __spreadArray([name], args, false));
      };
      EventEmitter.prototype.emitParallel = function (name) {
          var args = [];
          for (var _i = 1; _i < arguments.length; _i++) {
              args[_i - 1] = arguments[_i];
          }
          return _super.prototype.emitParallel.apply(this, __spreadArray([name], args, false));
      };
      EventEmitter.prototype.emitAsync = function (name) {
          var args = [];
          for (var _i = 1; _i < arguments.length; _i++) {
              args[_i - 1] = arguments[_i];
          }
          return this.emitAsync.apply(this, __spreadArray([name], args, false));
      };
      return EventEmitter;
  }(AbstractEventEmitter));

  ((function (_super) {
      __extends(DOMEventEmitter, _super);
      function DOMEventEmitter(target, options) {
          var _this = _super.call(this, __assign({ requireLoopRemove: true }, options)) || this;
          _this.target = target;
          return _this;
      }
      DOMEventEmitter.defineEvent = function (descriptor) {
          var name = descriptor && descriptor.name;
          if (!name)
              return;
          var names = name instanceof Array ? name : [name];
          names.forEach(function (it) {
              DOMEventEmitter.__composeEvents[it] = descriptor;
          });
      };
      DOMEventEmitter.getEventDescriptor = function (name) {
          return DOMEventEmitter.__composeEvents[name];
      };
      DOMEventEmitter.prototype.addListener = function (name, listener, capture) {
          if (capture === void 0) { capture = false; }
          _super.prototype.addListener.call(this, name, listener);
          this.target.addEventListener(name, listener, capture);
          var descriptor = DOMEventEmitter.getEventDescriptor(name);
          if (!descriptor)
              return;
          descriptor.addListener(this, name, listener, capture);
      };
      DOMEventEmitter.prototype.removeListener = function (name, listener, capture) {
          if (capture === void 0) { capture = false; }
          _super.prototype.removeListener.call(this, name, listener);
          this.target.removeEventListener(name, listener, capture);
          var descriptor = DOMEventEmitter.getEventDescriptor(name);
          if (!descriptor)
              return;
          descriptor.removeListener(this, name, listener, capture);
      };
      DOMEventEmitter.prototype.dispatch = function (name, detail, options) {
          var event = new CustomEvent(name, __assign(__assign({}, options), { detail: detail }));
          return this.target.dispatchEvent(event);
      };
      DOMEventEmitter.__composeEvents = {};
      return DOMEventEmitter;
  })(AbstractEventEmitter));

  function toNativeEventName(name) {
      return name.slice(2).toLocaleLowerCase();
  }
  var FingerProxyContext = react.createContext(null);
  var FingerProxy = react.memo(function FingerProxy(props) {
      var contextTarget = react.useContext(FingerProxyContext);
      var _a = props.target, target = _a === void 0 ? contextTarget ||
          (typeof document !== "undefined"
              ? document
              : void 0) : _a, _b = props.passive, passive = _b === void 0 ? true : _b, others = __rest(props, ["target", "passive"]);
      var events = useFingerEvents(others);
      react.useLayoutEffect(function () {
          var isProxyBoundary = !!contextTarget;
          var eventEntries = Object.entries(events);
          eventEntries.forEach(function (_a) {
              var name = _a[0], listener = _a[1];
              name = isProxyBoundary ? name : toNativeEventName(name);
              target.addEventListener(name, listener, { passive: passive });
          }, false);
          return function () {
              eventEntries.forEach(function (_a) {
                  var name = _a[0], listener = _a[1];
                  name = isProxyBoundary ? name : toNativeEventName(name);
                  target.removeEventListener(name, listener);
              }, false);
          };
      }, Object.values(props));
      return react.createElement(react.Fragment);
  });
  function FingerProxyBoundaryOwner(props) {
      if (!props)
          props = __assign({}, props);
      var onPointerDown = props.onPointerDown, onPointerMove = props.onPointerMove, onPointerUp = props.onPointerUp, onPointerCancel = props.onPointerCancel;
      var onKeyDown = props.onKeyDown, onKeyUp = props.onKeyUp, onFocus = props.onFocus, onBlur = props.onBlur;
      var emitter = new EventEmitter();
      var events = {
          onPointerDown: function (event) {
              if (onPointerDown)
                  onPointerDown(event);
              emitter.emit("onPointerDown", event);
          },
          onPointerMove: function (event) {
              if (onPointerMove)
                  onPointerMove(event);
              emitter.emit("onPointerMove", event);
          },
          onPointerUp: function (event) {
              if (onPointerUp)
                  onPointerUp(event);
              emitter.emit("onPointerUp", event);
          },
          onPointerCancel: function (event) {
              if (onPointerCancel)
                  onPointerCancel(event);
              emitter.emit("onPointerCancel", event);
          },
          onKeyDown: function (event) {
              if (onKeyDown)
                  onKeyDown(event);
              emitter.emit("onKeyDown", event);
          },
          onKeyUp: function (event) {
              if (onKeyUp)
                  onKeyUp(event);
              emitter.emit("onKeyUp", event);
          },
          onFocus: function (event) {
              if (onFocus)
                  onFocus(event);
              emitter.emit("onFocus", event);
          },
          onBlur: function (event) {
              if (onBlur)
                  onBlur(event);
              emitter.emit("onBlur", event);
          },
      };
      var addEventListener = function (name, listener) { return emitter.addListener(name, listener); };
      var removeEventListener = function (name, listener) { return emitter.removeListener(name, listener); };
      return [events, { addEventListener: addEventListener, removeEventListener: removeEventListener }];
  }
  var FingerProxyBoundary = react.memo(function FingerProxyBoundary(props) {
      var children = props.children, others = __rest(props, ["children"]);
      var _a = react.useMemo(function () { return FingerProxyBoundaryOwner(others); }, []), events = _a[0], target = _a[1];
      return react.createElement(FingerProxyContext.Provider, {
          value: target,
          children: children(events),
      });
  });
  var FingerProxyContainerCache = new Map();
  function FingerProxyContainer(type) {
      if (FingerProxyContainerCache.has(type)) {
          return FingerProxyContainerCache.get(type);
      }
      var FC = react.forwardRef(function FingerProxyContainerComponent(props, ref) {
          var eventBoundary = props.eventBoundary, others = __rest(props, ["eventBoundary"]);
          if (eventBoundary === false)
              return react.createElement(type, __assign(__assign({}, others), { ref: ref }));
          var eventProps = splitProps(others).eventProps;
          return react.createElement(FingerProxyBoundary, __assign(__assign({}, eventProps), { children: function (events) {
                  return react.createElement(type, __assign(__assign(__assign({}, others), events), { ref: ref }));
              } }));
      });
      FingerProxyContainerCache.set(type, FC);
      return FC;
  }

  registerFingerProvider(FingerPinchProvider);
  registerFingerProvider(FingerSwipeProvider);
  registerFingerProvider(FingerTapProvider);
  registerFingerProvider(FingerBasicProvider);
  registerFingerProvider(FingerShortcutProvider);

  exports.Finger = Finger;
  exports.FingerGlobal = FingerGlobal;
  exports.FingerOptions = FingerOptions;
  exports.FingerProxy = FingerProxy;
  exports.FingerProxyBoundary = FingerProxyBoundary;
  exports.FingerProxyContainer = FingerProxyContainer;
  exports.bindFingerGlobalEvents = bindFingerGlobalEvents;
  exports.composeFingerEvents = composeFingerEvents;
  exports.createFingerEvents = createFingerEvents;
  exports.useFingerEvents = useFingerEvents;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
