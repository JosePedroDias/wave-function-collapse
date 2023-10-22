export class Canvass {
    constructor([w, h]) {
        const el = document.createElement('canvas');
        el.setAttribute('width', w);
        el.setAttribute('height', h);
        const ctx = el.getContext('2d');
        this.el = el;
        this.ctx = ctx;
        this.dims= [w, h];

        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        this.textAlignment();
    }

    textAlignment(x = 0, y = 0) {
        this.ctx.textAlign = x === 0 ? 'left' : x === 1 ? 'right' : 'center';
        this.ctx.textBaseline = y === 0 ? 'top' : y === 1 ? 'bottom' : 'middle';
    }

    line([x0, y0], [x1, y1], fillColor = 'black') {
        this.ctx.fillStyle = fillColor;
        this.ctx.beginPath();
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x1, y1);
        this.ctx.stroke();
    }

    rect([ox, oy], [w, h], fillColor = 'black') {
        this.ctx.fillStyle = fillColor;
        this.ctx.fillRect(ox, oy, w, h);
    }

    draw(img, [x, y]) {
        this.ctx.drawImage(img.el, x, y);
        //this.ctx.drawImage(img.el, x, y, w, h);
        //this.ctx.drawImage(img.el, sx, sy, sw, sh, dx, dy, dw, dh);
    }

    drawScaled(img, [x, y], scale) {
        const [w, h] = img.dims;
        this.ctx.drawImage(img.el, 0, 0, w, h, x, y, scale * w, scale * h);
    }

    text(font, [x, y], content, fillColor = 'black') {
        this.ctx.fillStyle = fillColor;
        this.ctx.font = font;
        this.ctx.fillText(content, x, y);
    }
}

export class Imagee {
    constructor(url) {
        const el = document.createElement('img');
        el.src = url;
        this.el = el;
        this.onceReady = new Promise((resolve, reject) => {
            el.addEventListener('load', () => {
                this.dims = [el.width, el.height];
                resolve();
            });
            el.addEventListener('error', reject);
        });
    }
}
