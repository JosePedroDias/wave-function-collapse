import { sleep } from "./misc.mjs";

const DEBUG_LOAD = false;

const DELTA_MS = 150;
const MAX_ATTEMPTS = 40; // wait up to 6 secs
const TEST_FONT_SIZE = 24;

let topIndex = 0;

function testFont(fontName, style = 'normal', weight = 'normal') {
  const el = document.createElement('div');
  ++topIndex;
  const sampleText = `..Hello world! 123 ${fontName}..`;
  el.appendChild(document.createTextNode(sampleText));
  el.style = `pointer-events:none; position:absolute; z-index:10000; left:50px; top:${
    topIndex * (TEST_FONT_SIZE * 1.5)
  }px; background:purple; color:yellow; font-family:"${fontName}"; font-style:${style}; font-weight:${weight}; font-size:${TEST_FONT_SIZE}px; opacity:${
    DEBUG_LOAD ? '1' : '0.01'
  }`;
  document.body.appendChild(el);

  return function unmount() {
    document.body.removeChild(el);
  };
}

export function fontStyle(family, size, weight = 'normal', style = 'normal') {
    return `${weight} ${style} ${size}px "${family}"`
}

export async function fontLoader(family, weight = 'normal', style = 'normal') {
    let attemptNum = 0;
    let ok = false;

    const unmount = testFont(family);

    //DEBUG_LOAD && console.warn(`family:${family} weight:${weight} style:${style}`);

    while (attemptNum < MAX_ATTEMPTS) {
        if (document.fonts.check(fontStyle(family, TEST_FONT_SIZE, weight, style))) {
            ok = true;
            break;
        }
        ++attemptNum;
        await sleep(DELTA_MS);
    }

    DEBUG_LOAD &&
      console.warn(`${ok ? '🟢' : '🔴'} family:"${family}" weight:${weight} style:${style}`);

    !DEBUG_LOAD && unmount();
}
