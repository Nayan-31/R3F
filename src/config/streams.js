import goldMatcap from "../images/matcap1.png";
import pinkMatcap from "../images/matcap2.jpg";
import silverMatcap from "../images/matcap3.jpg";
import chromeMatcap from "../images/matcap4.jpg";
import redMatcap from "../images/matcap5.jpg";
import greenMatcap from "../images/matcap6.jpg";

export const EMISSION_POINT = [-0.44, -0.59, 0.98]; //streams kahaan se start hongi.
export const CUBES_PER_STREAM = 110; //har stream mein kitne cubes.

// Nayi image import karke yahan entry add karo; phase automatically calculate hoga.
const MATCAP_STREAMS = [ //har stream ka color aur texture.
  { color: "#ff80b0", matcap: pinkMatcap },
  { color: "#ffe18a", matcap: goldMatcap },
  { color: "#d9efff", matcap: silverMatcap },
  { color: "#b8bec9", matcap: chromeMatcap },
  { color: "#ff443d", matcap: redMatcap },
  { color: "#a1f294", matcap: greenMatcap },
];

export const STREAMS = MATCAP_STREAMS.map((stream, index) => ({
  ...stream,
  phase: (index / MATCAP_STREAMS.length) * Math.PI * 2, //Ye six streams ko 0°, 60°, 120°, 180°, 240°, 300° par evenly separate karta hai.
}));
