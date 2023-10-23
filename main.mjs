import { config } from './config.mjs';

import { ROBOTO_REGULAR_FNT } from './constants.mjs';
import { Canvass, Imagee } from './canvas.mjs';
import { fontLoader, fontStyle } from './font.mjs';
import { sleep, times } from './misc.mjs';
import { ui } from './ui.mjs';
import { DrawWorld } from './wfc.mjs';

(async function() {
    await fontLoader(ROBOTO_REGULAR_FNT);

    const img = new Imagee(config.tileset);
    await img.onceReady;

    function drawTileSheet() {
        const cvs = new Canvass(img.dims.map(n => n * config.canvasScale));
        document.body.appendChild(cvs.el);
        cvs.drawScaled(img, [0, 0], config.canvasScale);

        cvs.textAlignment(0.5, 0.5);

        const lineColor = 'gray';
        const indexColor = 'magenta';

        const S_FNT = fontStyle(ROBOTO_REGULAR_FNT, 8 * config.canvasScale);

        const dx = config.tileDims[0] * config.canvasScale;
        const dy = config.tileDims[1] * config.canvasScale;
        const xx = img.dims[0] / config.canvasScale;
        const yy = img.dims[1] / config.canvasScale;
        for (let iy of times(xx)) {
            for (let ix of times(yy)) {
                cvs.text(
                    S_FNT,
                    [   (ix + 0.25) * dx,
                        (iy + 0.25) * dy],
                    `${ix}`,
                    indexColor
                );
                cvs.text(
                    S_FNT,
                    [   (ix + 0.75) * dx,
                        (iy + 0.75) * dy],
                    `${iy}`,
                    indexColor
                );
                cvs.ctx.globalAlpha = 0.33;
                cvs.line([ix * dx, iy * dy], [(ix + 1) * dx,  iy      * dy], lineColor);
                cvs.line([ix * dx, iy * dy], [ ix      * dx, (iy + 1) * dy], lineColor);
                cvs.ctx.globalAlpha = 1;
            }
        }
    }

    // besides being generic, it normalizes forest tiles so they are drawn the same way as other tiles
    function _prepareSprites() {
        const TILE_FORESTN_INDEX = config.tilesVariants.findIndex((tile) => tile.name === 'TILE_FORESTN');
        let grassSprite;
        const sprites = config.tilesVariants.map((tv, idx) => {
            const isForest = idx >= TILE_FORESTN_INDEX;
            const [ox, oy] = tv.origin;
            const spr = new Canvass(config.tileDims);
            if (isForest) { // forest sprites need a grass tile to be drawn behind them
                spr.draw(grassSprite, [0, 0]);
            }
            spr.draw(img, [-ox, -oy]);
            if (idx === 0) grassSprite = spr;
            return spr;
        });
        return sprites;
    }

    function drawSprites() {
        const sprites = _prepareSprites();

        const dx = config.tileDims[0] * config.canvasScale;
        const dy = config.tileDims[1] * config.canvasScale;

        const worldDims = [ dx * sprites.length, dy ];
        const worldCanvas = new Canvass(worldDims);
        document.body.appendChild(worldCanvas.el);

        sprites.forEach((spr, idx) => {
            worldCanvas.drawScaled(spr, [dx * idx, 0], config.canvasScale);
        });
    }

    async function runWorld() {
        const options = ui();

        // override config
        config.canvasScale = parseInt(options.scale, 10);
        const dx = config.tileDims[0] * config.canvasScale;
        const dy = config.tileDims[1] * config.canvasScale;
        config.canvasTiles[0] = Math.floor(window.innerWidth  / dx);
        config.canvasTiles[1] = Math.floor(window.innerHeight / dy);

        const sprites = _prepareSprites();

        const worldDims = [
            dx * config.canvasTiles[0],
            dy * config.canvasTiles[1]
        ];
        const worldCanvas = new Canvass(worldDims);
        worldCanvas.textAlignment(0.5, 0.5);
        document.body.appendChild(worldCanvas.el);

        const S_FNT = fontStyle(ROBOTO_REGULAR_FNT,  8 * config.canvasScale);
        const M_FNT = fontStyle(ROBOTO_REGULAR_FNT, 11 * config.canvasScale);
        const L_FNT = fontStyle(ROBOTO_REGULAR_FNT, 14 * config.canvasScale);
        const fonts = [S_FNT, M_FNT, L_FNT];

        const dw = new DrawWorld(worldCanvas, sprites, [dx, dy], fonts);

        // setup initial state (optional)
        if (false) {
            const tileIndexLookup = new Map();
            config.tilesVariants.forEach((tv, idx) => tileIndexLookup.set(tv.name, idx));

            const tile = dw.world.getTile([10, 10]);
            const tileIndexToSet = tileIndexLookup.get('TILE_HOUSE');
            tile.possibilities = [tileIndexToSet, tileIndexToSet]; // I have to set it twice to avoid entropy being 0

            dw.world.waveFunctionCollapse();

            dw.update();
            await sleep(2000);
        }

        // run wave function collapse
        if (true) {
            let lastDrawnT = Date.now();

            let keepGoing = true;
            let iter = 0;

            const slowMode = options.stepMode === '500msPerStep';
            const onlyDrawAtTheEnd = options.stepMode === 'onlyEnd';

            if (onlyDrawAtTheEnd) console.time('wfc');
            while (keepGoing) {
                if (!onlyDrawAtTheEnd) {
                    const t = Date.now();
                    dw.update();
                    if (slowMode) {
                        document.title = `#${iter}`;
                        await sleep(500);
                    } else if (t - lastDrawnT > 100) {
                        document.title = `#${iter}`;
                        await sleep(0);
                        lastDrawnT = Date.now();
                    }
                }
                keepGoing = dw.world.waveFunctionCollapse();
                ++iter;
            }
            if (onlyDrawAtTheEnd) console.timeEnd('wfc');

            dw.update();
            document.title = `#${iter}`;
        }

        console.log('done!');
    }

    //drawTileSheet();
    //drawSprites();
    await runWorld();
})();
