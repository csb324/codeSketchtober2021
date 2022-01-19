precision mediump float;

// lets grab texcoords just for fun
varying vec2 vTexCoord;

// our texture coming from p5
uniform float time;
uniform float redFactor;
uniform float blueFactor;
uniform float greenFactor;
uniform float xFactor;
uniform float squares;

uniform sampler2D tex0;

// uniform sampler2D noisetex;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

float randomThreshold (in vec2 st) {
  float r = random(st);
  return (r * 0.05) + 0.475;
}

float getPixelated(float coord) {
  return fract(coord * 20.0);
}

float getVignette(in vec2 uv1) {
  float vignette1 = (2.0*uv1.x - 1.0) * (2.0 * uv1.y - 1.0);
  float vignette2 = (-2.0 * uv1.x + 1.0) * (2.0 * uv1.y - 1.0);
  return (0.0 - max(vignette1, vignette2));
}

float getChannelValue(float factor, vec2 uv1, float barvalue) {
  float result = 0.0;
  result += uv1.x / (40.0 * xFactor);
  result += uv1.y;

  result = fract(result * 8.0 + (time / 100.0));
  result = fract(cos(factor + result) + (xFactor * 2.0));

  result *= barvalue;
  float threshold = randomThreshold(vec2(uv1.x * 40.0, uv1.y));
  // threshold = 0.3;
  result = step(threshold + 0.15, result);

  return result;
}

vec3 getChannelValue(vec3 fs, vec2 uv, vec3 bars) {
  return vec3(
    getChannelValue(fs.r, uv, bars.r),
    getChannelValue(fs.g, uv, bars.g),
    getChannelValue(fs.b, uv, bars.b)
  );    
}

float invertSideways(in float proportion) {
  float leftOrRight = step(0.5, proportion); // 0 or 1
  leftOrRight *= 2.0; // 0 or 2
  leftOrRight -= 1.0; // -1 or 1
  return leftOrRight;
}

void main() {

  vec2 uv = vTexCoord;
  // // the texture is loaded upside down and backwards by default so lets flip it
  uv = 1.0 - uv;
  uv.x = 1.0 - uv.x;


  vec2 st = uv - vec2(0.5, 0.5);
  st = st*xFactor;
  st.x = st.x*xFactor;
  st = fract(st);

  float pixelQ = squares;  
  vec2 pixUV = floor(uv * pixelQ) / pixelQ;
  float barWidth = (1.0 / pixelQ) / 2.8;
  float rows = step(0.05, fract(uv.y * pixelQ));

  vec3 pixels = vec3(uv.x + barWidth, uv.x, uv.x - barWidth);
  pixels *= pixelQ;
  pixels = fract(pixels);
  pixels = step(0.65, pixels);
  pixels *= rows;

  vec3 factors = vec3(redFactor, greenFactor, blueFactor);
  vec3 pixelated = getChannelValue(factors, pixUV, pixels);

  vec4 tex = texture2D(tex0, fract(st * vec2(xFactor, 1.0/xFactor)));
  tex.rgb *= pixels;
  pixelated = mix(pixelated, tex.rgb, 0.4);

  gl_FragColor = vec4(pixelated + getVignette(uv)*0.7, 1.0);

}