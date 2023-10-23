# intro

Wave function collapse in JS

Kudos to [CodingQuest](https://www.youtube.com/@CodingQuest2023) and his
[The Wave Function Collapse algorithm](https://www.youtube.com/watch?v=qRtrj6Pua2A)
and [accompanying repo implementation in Python](https://github.com/CodingQuest2023/Algorithms) which I ported to Javascript and slightly restructured.


# changelog

## 2023/10/23
- `wfc.mjs` no longer imports `config.mjs` (configuration is now received via DrawWorld.ctor args and Tile's static property setting)
- minor UI improvements (font scales with sprite scale, github link)
- early experiments with manipulating initial state

# potential todo list

- manipulate initial state:
    - by drawing solid forms (circle, bresenham line, rect)
    - by using simplex noise to drive different zones with different weights?
- create a WFC editor that reads/writes JSON, similar to [this idea here](https://www.youtube.com/watch?v=OiJmO2BRcVE)

# structure

The abstract algorithm code sits under `wfc.mjs`.
`canvas.mjs` has the simplest canvas abstraction I could come up for these purposes.
In `main.mjs` you can have the code display the spritesheet, the configured sprites and also run the algorithm (the function activate ATM).
`config.mjs` drives this WFC setup. The only non-generic code has to do with a fix which superimposes forest over grass so that WFC doesn't have to handle special use cases.
Created a simple UI overlay which reads and overrides the URL search parameters for demo purposes, it sits on `ui.mjs`.

# resources


## canvas cheat sheet
- https://simon.html5.org/dump/html5-canvas-cheat-sheet.html

## code

- [alea](https://github.com/coverslide/node-alea)
- [simplex-noise](https://github.com/jwagner/simplex-noise.js)

## artwork

- 2D ortho
    - https://merchant-shade.itch.io/16x16-puny-world
    - https://www.spriters-resource.com/arcade/pacman/sheet/52631/
    - https://www.spriters-resource.com/pc_computer/pipemania/sheet/19847/
- 2D side-scroller
    - https://www.spriters-resource.com/nes/theterminator/sheet/208262/
- 2D hex
    - https://kenney.nl/assets/hexagon-pack
    - https://opengameart.org/content/hex-tileset-pack
- 3D hex
    - https://kenney-assets.itch.io/hexagon-kit

## fonts
- https://fonts.google.com/specimen/Roboto
- https://www.fontsquirrel.com/tools/webfont-generator


## inspiration

- https://www.youtube.com/watch?v=OiJmO2BRcVE (the godot WFC editor)
