const pointers = new Map<number, { x: number; y: number; dx: number; dy: number }>();

export function createPointers() {
  const mousemove = (e: MouseEvent) => {
    let pointer = pointers.get(-1);

    if (!pointer) {
      pointers.set(
        -1,
        (pointer = {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          dx: 0,
          dy: 0,
        }),
      );
    }
    pointer.dx = e.clientX - pointer.x;
    pointer.dy = e.clientY - pointer.y;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  };
  document.addEventListener('mousemove', mousemove);
  // onCleanup(() => document.removeEventListener("mousemove", mousemove));

  const touchstart = (e: TouchEvent) => {
    for (const touch of e.changedTouches) {
      pointers.set(touch.identifier, {
        x: touch.clientX,
        y: touch.clientX,
        dx: 0,
        dy: 0,
      });
    }
  };
  document.addEventListener('touchstart', touchstart);
  // onCleanup(() => document.removeEventListener("touchstart", touchstart));

  const touchend = (e: TouchEvent) => {
    for (const touch of e.changedTouches) {
      pointers.delete(touch.identifier);
    }
  };
  document.addEventListener('touchend', touchend);
  // onCleanup(() => document.removeEventListener("touchend", touchend));

  const touchmove = (e: TouchEvent) => {
    for (const touch of e.changedTouches) {
      let pointer = pointers.get(touch.identifier);
      if (!pointer) {
        pointers.set(
          touch.identifier,
          (pointer = {
            x: touch.clientX,
            y: touch.clientX,
            dx: 0,
            dy: 0,
          }),
        );
      }
      pointer.dx = touch.clientX - pointer.x;
      pointer.dy = touch.clientY - pointer.y;
      pointer.x = touch.clientX;
      pointer.y = touch.clientY;
    }
  };
  document.addEventListener('touchmove', touchmove);
  // onCleanup(() => document.removeEventListener("touchmove", touchmove));

  return pointers;
}
