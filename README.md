# React Finger

React Finger is a library of gesture events for React that allows developers to use a single set of events for both desktop and mobile devices.

# Install

```
npm install react-finger --save
```

# Events

- **onPointerDown**: Press the mouse or touch point
- **onPointerMove**: Moves the mouse or touch point
- **onPointerUp**: Bounce the mouse or touch point
- **onPointerCancel**: Cancels the mouse or touch point
- **onTap**: Quickly tap the mouse or touch point
- **onTapHold**: Hold for more than 600ms
- **onDoubleTap**: Quick tap twice (within 300ms)
- **onSwipe**: Swipe freely
- **onSwipeUp**: Swipe up
- **onSwipeRight**: Swipe right
- **onSwipeDown**: Swipes down
- **onSwipeLeft**: Swipe left
- **onPinchStart**: Multi-finger gesture start (currently supports two-finger pinch)
- **onPinch**: Multi-finger gesture update (currently supports two-finger pinch)
- **onPinchEnd**: Multi-finger gesture end (current weight supports two-finger pinch)

# Usage

**Example 1:** Hello React Finger

```jsx
import { Finger } from "react-finger";

const FingeredDiv = Finger("div");

function Demo(){
  return (
    <FingeredDiv 
      onTap = { event=>console.log('onTap',event) }
      onSwipe = { event=>console.log('onSwipe',event.direction) }
    > 
      Something...
    </FingeredDiv>
  );
}
```

**Example 2:** Using useFingerEvents

```jsx
import { useFingerEvents } from "react-finger";

function Demo(){
  const events = useFingerEvents({
    onTap: event=>console.log('onTap',event),
    onSwipe: event=>console.log('onSwipe',event.direction),
  });
  return (
    <div {...events}> Something... </div>
  );
}
```

**Example 3:** Using createFingerEvents

```jsx
import { createFingerEvents } from "react-finger";

class Demo extends Component {
  events = createFingerEvents({
    onTap: event=>console.log('onTap',event),
    onSwipe: event=>console.log('onSwipe',event.direction),
  });
  render() {
    return (
      <div {...this.events}> Something... </div>
    );
  }
}
```

**Example 4:** Bound to the Document

```jsx
import { FingerProxy } from "react-finger";

function Demo(){
  return (
    <FingerProxy 
      onTap = { event=>console.log('Tap on the document',event) }
    />
  );
}
```

**Example 5:** Bound to the Boundary

```jsx
import { FingerProxy, FingerProxyContainer } from "react-finger";

const YourBoundaryWrapper = FingerProxyContainer("div");

function Demo(){
  return (
    <YourBoundaryWrapper>
      Something...
      <FingerProxy 
        onTap = { event=>console.log('Tap on the Boundary',event) }
      />
      Something...
    </YourBoundaryWrapper>
  );
}
```