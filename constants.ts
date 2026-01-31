
import { ThemeKey, ThemePreset } from './types';

export const THEME_PRESETS: Record<ThemeKey, ThemePreset> = {
  [ThemeKey.BOTANICAL]: {
    name: "Vintage Botanical",
    prompt: "Junk journal page background, vintage botanical illustration, faded french handwriting, pressed wild flowers, old yellowed paper texture, coffee stains, lace borders, shabby chic aesthetic, hyper-realistic texture, decoupage style"
  },
  [ThemeKey.STEAMPUNK]: {
    name: "Industrial Steampunk",
    prompt: "Junk journal page, steampunk aesthetic, gears and cogs, victorian industrial diagrams, burnt paper edges, sepia tones, grunge texture, blueprints background, brass metallic accents, mixed media collage"
  },
  [ThemeKey.VICTORIAN]: {
    name: "Victorian Ephemera",
    prompt: "Junk journal page, victorian ladies fashion fashion plate, vintage tickets and stamps, torn newspaper clippings from 1800s, elegant cursive script, pastel roses, distress ink edges, scrapbook layer style"
  },
  [ThemeKey.CUSTOM]: {
    name: "Custom Magic",
    prompt: ""
  }
};

// Use the public redirector which is most compatible with browser fetch and CORS
export const POLLINATIONS_BASE_URL = "https://image.pollinations.ai/prompt/";
export const HARDCODED_POLLINATIONS_KEY = "sk_8jvqDKK7X2JMENDyeY3BCliHUF4goTVa";
