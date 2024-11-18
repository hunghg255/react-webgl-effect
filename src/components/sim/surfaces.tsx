import REGL from "regl";

export const TEXTURE_DOWNSAMPLE = 3;

type Config = {
  filter: REGL.TextureMagFilterType;
  downsample?: number;
};

function doubleFbo(regl: REGL.Regl, config: Config) {
  const fbos = [createFbo(regl, config), createFbo(regl, config)];
  return {
    read() {
      return fbos[0];
    },
    write() {
      return fbos[1];
    },
    swap() {
      fbos.reverse();
    },
  };
}

function createFbo(regl: REGL.Regl, { filter, downsample = TEXTURE_DOWNSAMPLE }: Config) {
  const tex = regl.texture({
    width: window.innerWidth >> downsample,
    height: window.innerHeight >> downsample,
    min: filter,
    mag: filter,
    type: "half float",
  });
  const framebuffer = regl.framebuffer({
    color: tex,
    depthStencil: false,
    colorType: "half float",
  });
  window.addEventListener("resize", () => {
    tex.resize(window.innerWidth >> downsample, window.innerHeight >> downsample);
    framebuffer.resize(window.innerWidth >> downsample, window.innerHeight >> downsample);
  });
  return framebuffer;
}

export function createRegl(c: HTMLCanvasElement) {
  const gl = c.getContext("webgl", {
    alpha: false,
    depth: false,
    stencil: false,
    antialias: false,
  });
  const regl = REGL({
    gl: gl!,
    extensions: ["OES_texture_half_float", "OES_texture_half_float_linear"],
  });

  const density = doubleFbo(regl, { filter: "linear", downsample: 0 });
  const velocity = doubleFbo(regl, { filter: "linear" });
  const pressure = doubleFbo(regl, { filter: "nearest" });
  const divergenceTex = createFbo(regl, { filter: "nearest" });

  return { regl, density, velocity, pressure, divergenceTex };
}
