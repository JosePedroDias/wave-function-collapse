# intro

Wave function collapse in JS

Kudos to [CodingQuest](https://www.youtube.com/@CodingQuest2023) and his
[The Wave Function Collapse algorithm](https://www.youtube.com/watch?v=qRtrj6Pua2A)
and [accompanying repo implementation in Python](https://github.com/CodingQuest2023/Algorithms) which I ported to Javascript and slightly restructured.

# structure

The abstract algorithm code sits under `wfc.mjs`.  
`canvas.mjs` has the simplest canvas abstraction I could come up for these purposes.  
In `main.mjs` you can have the code display the spritesheet, the configured sprites and also run the algorithm (the function activate ATM).  
`config.mjs` drives this WFC setup. The only non-generic code has to do with a fix which superimposes forest over grass so that WFC doesn't have to handle special use cases.  
Created a simple UI overlay which reads and overrides the URL search parameters for demo purposes, it sits on `ui.mjs`.

# resources

## canvas
- https://simon.html5.org/dump/html5-canvas-cheat-sheet.html

## artwork

- https://merchant-shade.itch.io/16x16-puny-world


## fonts
- https://fonts.google.com/specimen/Roboto
- https://www.fontsquirrel.com/tools/webfont-generator
