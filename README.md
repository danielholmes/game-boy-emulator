# Gebby - Game Boy Emulator

[![Build Status](https://travis-ci.org/danielholmes/gebby.svg?branch=master)](https://travis-ci.org/danielholmes/gebby)

Monorepo for a Game Boy emulator and related tools written in Typescript. Goals:

 - Accuracy. I want this to be compatible with as many ROMs as possible. To achieve this I want to make the simulation 
   and modelling as accurate as possible and keep a high test coverage.
 - Flexibility. Should be usable in multiple JS environments (e.g. browser, node, react native)


## Requirements

 - [Yarn (tested with 1.13.0)](https://yarnpkg.com/)


## Setting up Dev

```bash
yarn
```


## Roadmap

 0. Rework mmu a little. Include tests and use explicit ranges. Maybe a cond
 0. Generate op codes table report.
    - Instruction knows size of operands based in low level calls
    - Also know timing. Might need to better encapsulate low level (e.g. double decrements)
 1. interrupts
 2. complete GPU enough (nintendo logo is a background, not sprite)
 3. Set up cli running and displaying bios
 4. Set up browser running and displaying bios
 5. Set up blarg test roms infrastructure
 6. get tetris running
 7. input, sound, etc - see https://youtu.be/ecTQVa42sJc?t=374
 8. more complicated carts


## References

### General

 - http://www.codeslinger.co.uk/pages/projects/gameboy.html
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
 - Op Codes - http://gameboy.mongenel.com/dmg/opcodes.html
 - Sound - http://gbdev.gg8.se/wiki/articles/Gameboy_sound_hardware
 - Hardware - http://marc.rawer.de/Gameboy/Docs/GBProject.pdf
 - Op codes table - http://www.pastraiser.com/cpu/gameboy/gameboy_opcodes.html

### Overviews

 - https://www.cl.cam.ac.uk/~pv273/slides/emulation.pdf
 - Schematics - https://console5.com/wiki/Game_Boy_DMG-01
 - https://www.youtube.com/watch?v=t0V-D2YMhrs&index=2&list=PLu3xpmdUP-GRDp8tknpXC_Y4RUQtMMqEu
 - https://www.youtube.com/watch?v=GBYwjch6oEE
 - https://www.youtube.com/watch?v=HyzD8pNlpwI

### GPU

 - https://www.reddit.com/r/EmuDev/comments/4tpmop/the_overlap_in_the_tile_data_region_in_the_game/
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

 - General z80 coding on gb - https://www.youtube.com/watch?v=LpQCEwk2U9w
 - General - https://www.youtube.com/watch?v=PMlGQWytWJg
 - Joypad - https://www.youtube.com/watch?v=vLRTA8j1Qhc
 - Sound - https://www.youtube.com/watch?v=LCPLGkYJk5M
 - Bank Switching - https://www.youtube.com/watch?v=ggyIp9CPTi4
 
 
 - http://www.loirak.com/gameboy/
 - http://www.loirak.com/gameboy/gbprog.php
 - http://gbdev.gg8.se/wiki/articles/GBDK
 - https://videlais.com/2016/07/03/programming-game-boy-games-using-gbdk-part-1-configuring-programming-and-compiling/
 - https://github.com/hschmitt/gbdk
 - For the C side of things:
   - https://www.youtube.com/watch?v=hE7l6Adoiiw&list=PL6B940F08B9773B9F
   - https://www.youtube.com/watch?v=ktfIkfNz99Y - might be newer version of the above
