# Game Boy Emulator

[![Build Status](https://travis-ci.org/danielholmes/functional-game-engine.svg?branch=master)](https://travis-ci.org/danielholmes/functional-game-engine)

Game Boy emulation in JavaScript (browser or nodeJS). 


## Requirements

 - [Yarn (tested with 1.13.0)](https://yarnpkg.com/)


## Setting up Dev

```bash
yarn
```


## Roadmap

 1. interrupts
 2. complete GPU enough (nintendo logo is a background, not sprite)
 3. Set up cli running and displaying bios
 4. Set up browser running and displaying bios
 5. Set up blarg test roms infrastructure
 6. get tetris running
 7. input, sound, etc
 8. more complicated carts


## References

### General

 - https://realboyemulator.wordpress.com/posts/
 - https://cturt.github.io/cinoop.html
 - https://blog.rekawek.eu/2017/02/09/coffee-gb/
 - https://robdor.com/2016/08/10/gameboy-emulator-half-carry-flag/
 - http://imrannazar.com/GameBoy-Emulation-in-JavaScript

### Manuals/Comprehensive Reference

 - https://gekkio.fi/files/gb-docs/gbctr.pdf < See for some precise CPU timings
 - http://marc.rawer.de/Gameboy/Docs/GBCPUman.pdf
 - http://problemkaputt.de/pandocs.htm 
 - http://nnarain.github.io/2016/07/21/Gameboy-Specs.html

### Overviews

 - https://www.cl.cam.ac.uk/~pv273/slides/emulation.pdf
 - https://www.youtube.com/watch?v=t0V-D2YMhrs&index=2&list=PLu3xpmdUP-GRDp8tknpXC_Y4RUQtMMqEu
 - https://www.youtube.com/watch?v=GBYwjch6oEE
 - https://www.youtube.com/watch?v=RZUDEaLa5Nw
 - https://media.ccc.de/v/33c3-8029-the_ultimate_game_boy_talk

### GPU

 - https://forums.nesdev.com/viewtopic.php?f=20&t=17754
 - http://blog.kevtris.org/blogfiles/Nitty%20Gritty%20Gameboy%20VRAM%20Timing.txt

### Testing

 - See blarg's test ROM https://github.com/taisel/GameBoy-Online
 - https://github.com/Gekkio/mooneye-gb/blob/master/docs/accuracy.markdown
 - https://realboyemulator.wordpress.com/2013/01/03/a-look-at-the-game-boy-bootstrap-let-the-fun-begin/ 
 
### Implementations

 - https://github.com/gbdev/awesome-gbdev
 - https://github.com/trekawek/coffee-gb/
 - https://github.com/alexaladren/jsgameboy
 - https://github.com/nakardo/node-gameboy
 - https://github.com/riperiperi/amebo
 - https://github.com/nnarain/gameboycore
 
## Making games

 - http://www.loirak.com/gameboy/
 - http://www.loirak.com/gameboy/gbprog.php
 - http://gbdev.gg8.se/wiki/articles/GBDK
 - https://videlais.com/2016/07/03/programming-game-boy-games-using-gbdk-part-1-configuring-programming-and-compiling/
 - https://github.com/hschmitt/gbdk
 - For the C side of things:
   - https://www.youtube.com/watch?v=hE7l6Adoiiw&list=PL6B940F08B9773B9F
   - https://www.youtube.com/watch?v=ktfIkfNz99Y - might be newer version of the above
