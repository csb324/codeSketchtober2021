precision mediump float;

// lets grab texcoords just for fun
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;
uniform sampler2D noisetex;

vec3 decodeSRGB(vec3 screenRGB)
{
    vec3 a = screenRGB / 12.92;
    vec3 b = pow((screenRGB + 0.055) / 1.055, vec3(2.4));
    vec3 c = step(vec3(0.04045), screenRGB);
    return mix(a, b, c);
}

vec3 grayscale(vec3 tex) {
  return vec3((tex.r + tex.g + tex.b) / 3.0);
}

void main() {

  vec2 uv = vTexCoord;
  // the texture is loaded upside down and backwards by default so lets flip it
  uv = 1.0 - uv;
  uv.x = 1.0 - uv.x;

  vec2 scaled = fract(uv * 20.0);

  // get the webcam as a vec4 using texture2D
  vec4 tex = texture2D(tex0, uv);
  vec4 nt = texture2D(noisetex, scaled);

  // lets invert the colors just for kicks
  tex.rgb = grayscale(tex.rgb);
  tex.rgb = vec3(  step((nt.r * 0.8) + 0.1, grayscale(tex.rgb)));


  gl_FragColor = tex;
}