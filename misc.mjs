let rndFn = Math.random;

export function setRandomFunction(fn) {
    rndFn = fn;
}

export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function times(n) {
    const arr = new Array(n).fill(true);
    return arr.map((_, i) => i);
}

export function randomFromArray(arr) {
    const l = arr.length;
    const i = Math.floor( l * rndFn() );
    return arr[i];
}

function _weightedIndices(weights) {
    let indices = [];
    weights.forEach((weight, index) => {
        const part = times(weight).map((_) => index);
        indices = indices.concat(part);
    });
    return indices;
}

export function randomFromArrayWeighted(arr, weights) {
    const arrIndices = _weightedIndices(weights);
    const index = randomFromArray(arrIndices);
    return arr[index];
}

// lame test
if (false) {
    const arr = ['a', 'b', 'c'];
    const weights = [6, 2, 1];
    console.log(_weightedIndices(weights));
    for (const i of times(20)) {
        //console.log(`#${i}, ${randomFromArray(arr)}`);
        console.log(`#${i}, ${randomFromArrayWeighted(arr, weights)}`);
    }
    throw new Error('asd');
}
