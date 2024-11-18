import { useEffect, useRef } from 'react';

import { createPointers } from '@/components/sim/pointers';
import { createSim } from '@/components/sim/shaders';

function App() {
  const c = useRef<any>(null);

  useEffect(() => {
    function resize() {
      c.current.width = window.innerWidth;
      c.current.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    // onCleanup(() => window.removeEventListener('resize', resize));
    resize();

    try {
      if (!c.current) {
        return;
      }

      const pointers = createPointers();

      const { regl, update, fullscreen, createSplat } = createSim(c.current);
      let t = 0;

      regl.frame(() => {
        fullscreen(() => {
          const red = Math.sin(t + 0) * 0.8 + 0.8;
          const green = Math.sin(t + 2) * 0.8 + 0.8;
          const blue = Math.sin(t + 4) * 0.8 + 0.8;
          t += 0.1;

          for (const [, pointer] of pointers) {
            createSplat(
              pointer.x,
              pointer.y,
              pointer.dx * 10,
              pointer.dy * 10,
              [red, green, blue],
              0.0005,
            );
            pointer.dx *= 0.5;
            pointer.dy *= 0.5;
          }

          update();
        });
      });
    } catch (e) {
      console.error(e);
      if (c.current) c.current.remove();
    }
  }, []);

  return (
    <div>
      <canvas ref={c} id='c'></canvas>
    </div>
  );
}

export default App;
