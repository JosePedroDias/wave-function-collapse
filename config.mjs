const GRASS    =  0;
const WATER    =  1;
const FOREST   =  2;
const COAST_N  =  3;
const COAST_E  =  4;
const COAST_S  =  5;
const COAST_W  =  6;
const FOREST_N =  7;
const FOREST_E =  8;
const FOREST_S =  9;
const FOREST_W = 10;
const ROCK_N   = 11;
const ROCK_E   = 12;
const ROCK_S   = 13;
const ROCK_W   = 14;
const ROCK     = 15;

const L = 16; // tile side in pixels

const tilesVariants = [
    { name: 'TILE_GRASS',     origin: [ 16,   0], rules: [GRASS,    GRASS,    GRASS,    GRASS],    weight: 16 },
    { name: 'TILE_WATER',     origin: [128, 176], rules: [WATER,    WATER,    WATER,    WATER],    weight:  4 },
    { name: 'TILE_FOREST',    origin: [ 16, 128], rules: [FOREST,   FOREST,   FOREST,   FOREST],   weight:  5 },
    { name: 'TILE_COASTN',    origin: [128, 160], rules: [GRASS,    COAST_N,  WATER,    COAST_N],  weight:  5 },
    { name: 'TILE_COASTE',    origin: [144, 176], rules: [COAST_E,  GRASS,    COAST_E,  WATER],    weight:  5 },
    { name: 'TILE_COASTS',    origin: [128, 192], rules: [WATER,    COAST_S,  GRASS,    COAST_S],  weight:  5 },
    { name: 'TILE_COASTW',    origin: [112, 176], rules: [COAST_W,  WATER,    COAST_W,  GRASS],    weight:  5 },
    { name: 'TILE_COASTNE',   origin: [144, 160], rules: [GRASS,    GRASS,    COAST_E,  COAST_N],  weight:  5 },
    { name: 'TILE_COASTSE',   origin: [144, 192], rules: [COAST_E,  GRASS,    GRASS,    COAST_S],  weight:  5 },
    { name: 'TILE_COASTSW',   origin: [112, 192], rules: [COAST_W,  COAST_S,  GRASS,    GRASS],    weight:  5 },
    { name: 'TILE_COASTNW',   origin: [112, 160], rules: [GRASS,    COAST_N,  COAST_W,  GRASS],    weight:  5 },
    { name: 'TILE_COASTNE2',  origin: [176, 160], rules: [COAST_E,  COAST_N,  WATER,    WATER],    weight:  2 },
    { name: 'TILE_COASTSE2',  origin: [176, 176], rules: [WATER,    COAST_S,  COAST_E,  WATER],    weight:  2 },
    { name: 'TILE_COASTSW2',  origin: [160, 176], rules: [WATER,    WATER,    COAST_W,  COAST_S],  weight:  2 },
    { name: 'TILE_COASTNW2',  origin: [160, 160], rules: [COAST_W,  WATER,    WATER,    COAST_N],  weight:  2 },
    { name: 'TILE_ROCKN',     origin: [ 16,  96], rules: [ROCK,     ROCK_N,   GRASS,    ROCK_N],   weight:  4 },
    { name: 'TILE_ROCKE',     origin: [  0,  80], rules: [ROCK_E,   ROCK,     ROCK_E,   GRASS],    weight:  4 },
    { name: 'TILE_ROCKS',     origin: [ 16,  64], rules: [GRASS,    ROCK_S,   ROCK,     ROCK_S],   weight:  4 },
    { name: 'TILE_ROCKW',     origin: [ 32,  80], rules: [ROCK_W,   GRASS,    ROCK_W,   ROCK],     weight:  4 },
    { name: 'TILE_ROCKNE',    origin: [  0,  96], rules: [ROCK_E,   ROCK_N,   GRASS,    GRASS],    weight:  4 },
    { name: 'TILE_ROCKSE',    origin: [  0,  64], rules: [GRASS,    ROCK_S,   ROCK_E,   GRASS],    weight:  4 },
    { name: 'TILE_ROCKSW',    origin: [ 32,  64], rules: [GRASS,    GRASS,    ROCK_W,   ROCK_S],   weight:  4 },
    { name: 'TILE_ROCKNW',    origin: [ 32,  96], rules: [ROCK_W,   GRASS,    GRASS,    ROCK_N],   weight:  4 },
    { name: 'TILE_FORESTN',   origin: [ 16, 144], rules: [FOREST,   FOREST_N, GRASS,    FOREST_N], weight:  4 },
    { name: 'TILE_FORESTE',   origin: [  0, 128], rules: [FOREST_E, FOREST,   FOREST_E, GRASS],    weight:  4 },
    { name: 'TILE_FORESTS',   origin: [ 16, 112], rules: [GRASS,    FOREST_S, FOREST,   FOREST_S], weight:  4 },
    { name: 'TILE_FORESTW',   origin: [ 32, 128], rules: [FOREST_W, GRASS,    FOREST_W, FOREST],   weight:  4 },
    { name: 'TILE_FORESTNE',  origin: [  0, 144], rules: [FOREST_E, FOREST_N, GRASS,    GRASS],    weight:  4 },
    { name: 'TILE_FORESTSE',  origin: [  0, 112], rules: [GRASS,    FOREST_S, FOREST_E, GRASS],    weight:  4 },
    { name: 'TILE_FORESTSW',  origin: [ 32, 112], rules: [GRASS,    GRASS,    FOREST_W, FOREST_S], weight:  4 },
    { name: 'TILE_FORESTNW',  origin: [ 32, 144], rules: [FOREST_W, GRASS,    GRASS,    FOREST_N], weight:  4 },
    { name: 'TILE_FORESTNE2', origin: [ 96, 128], rules: [FOREST,   FOREST,   FOREST_E, FOREST_N], weight:  2 },
    { name: 'TILE_FORESTSE2', origin: [ 96, 112], rules: [FOREST_E, FOREST,   FOREST,   FOREST_S], weight:  2 },
    { name: 'TILE_FORESTSW2', origin: [112, 112], rules: [FOREST_W, FOREST_S, FOREST,   FOREST],   weight:  2 },
    { name: 'TILE_FORESTNW2', origin: [112, 128], rules: [FOREST,   FOREST_N, FOREST_W, FOREST],   weight:  2 },
    { name: 'TILE_HOUSE',      origin: [ 4*L, 26*L], rules: [GRASS,    GRASS,    GRASS,    GRASS],    weight: 0 },
    { name: 'TILE_HOUSE_CYAN', origin: [ 5*L, 34*L], rules: [GRASS,    GRASS,    GRASS,    GRASS],    weight: 0 },
    { name: 'TILE_HOUSE_RED',  origin: [15*L, 34*L], rules: [GRASS,    GRASS,    GRASS,    GRASS],    weight: 0 },
];

export const config = {
    tileset: './resources/images/punyworld-overworld-tileset.png',
    tileDims: [16, 16],
    canvasTiles: [20, 20],
    canvasScale: 2,
    tilesVariants,
};
