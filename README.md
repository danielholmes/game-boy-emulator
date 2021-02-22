# Gebby - Game Boy Emulator

[![Build Status](https://travis-ci.org/danielholmes/gebby.svg?branch=master)](https://travis-ci.org/danielholmes/gebby)

Monorepo for a Game Boy emulator and related tools written in Typescript. Goals:

 - Accuracy. I want this to be compatible with as many ROMs as possible. To achieve this I want to make the simulation 
   and modelling as accurate as possible and keep a high test coverage.
 - Flexibility. Should be usable in multiple JS environments (e.g. browser, node, react native)


## Current Status

 - Runs bios correctly and you can see the bg and tile maps loaded into VRam correctly. This is visible in the 
   [`browser-dev` package](./browser-dev)


## Requirements

 - [Yarn (tested with 1.13.0)](https://yarnpkg.com/)


## Setting up Dev

```bash
yarn
```


## Roadmap

 - Generate operation based on op codes table (see references). typescript includes a way to generate TS code.
 - Rework mmu a little. Include tests and use explicit ranges
   - IO should not be a block of memory. MMU should defer to registers on individual io 
     devices
     
   - VRam and working ram are memory blocks
   - not sure about oam, zero page
   - BIOS has a register on itself to indicate state
   - see https://github.com/Gekkio/mooneye-gb/blob/master/core/src/hardware/mod.rs
 - implement timers - http://www.codeslinger.co.uk/pages/projects/gameboy/timers.html
 - See re: initialization of RAM http://bgb.bircd.org/pandocs.htm#powerupsequence
 - Generate op codes table report.
    - Instruction knows size of operands based in low level calls
    - Also know timing. Might need to better encapsulate low level (e.g. double decrements)
 - interrupts
   - see: https://youtu.be/GBYwjch6oEE?list=WL&t=2239
     checked only between instructions
     handling takes 5 machine cycles (20 clock)
     if 2 happen then only highest priority handled
 - complete GPU enough (nintendo logo is a background, not sprite)
 - Set up cli running and displaying bios
 - Set up browser running and displaying bios
 - Set up blarg test roms infrastructure
 - get tetris running
 - input, sound, etc - see https://youtu.be/ecTQVa42sJc?t=374
 - more complicated carts


## References

### General

 - http://www.codeslinger.co.uk/pages/projects/gameboy.html
 - https://realboyemulator.wordpress.com/posts/
 - https://cturt.github.io/cinoop.html
 - https://blog.rekawek.eu/2017/02/09/coffee-gb/
 - https://robdor.com/2016/08/10/gameboy-emulator-half-carry-flag/
 - http://imrannazar.com/GameBoy-Emulation-in-JavaScript
 - mooneye gb author - https://gekkio.fi/blog/
 - hardware basics (covers CPU instruction sets, memory mapping, devices, interrupts)
   https://www.youtube.com/watch?v=9-KUm9YpPm0

### Manuals/Comprehensive Reference

 - https://gekkio.fi/files/gb-docs/gbctr.pdf < See for some precise CPU timings
 - http://marc.rawer.de/Gameboy/Docs/GBCPUman.pdf
 - http://problemkaputt.de/pandocs.htm 
 - http://nnarain.github.io/2016/07/21/Gameboy-Specs.html
 - Op Codes - http://gameboy.mongenel.com/dmg/opcodes.html
 - Sound - http://gbdev.gg8.se/wiki/articles/Gameboy_sound_hardware
 - Hardware - http://marc.rawer.de/Gameboy/Docs/GBProject.pdf
 - Op codes table - https://github.com/tdrmk/gameboy_opcodes
 - Mooneye mentions this is more accurate for cartridge handling than pandocs
   https://github.com/AntonioND/giibiiadvance/blob/master/docs/TCAGBD.pdf

### Overviews

 - https://www.cl.cam.ac.uk/~pv273/slides/emulation.pdf
 - Schematics - https://console5.com/wiki/Game_Boy_DMG-01
 - https://www.youtube.com/watch?v=t0V-D2YMhrs&index=2&list=PLu3xpmdUP-GRDp8tknpXC_Y4RUQtMMqEu
 - Mooneye-gb author on accuracy - https://www.youtube.com/watch?v=GBYwjch6oEE
 - https://www.youtube.com/watch?v=HyzD8pNlpwI
 - http://www.diva-portal.org/smash/get/diva2:433485/FULLTEXT01.pdf
 - http://www.romhacking.net/documents/%5b544%5dGameBoyProgrammingManual.pdf

### Input

 - https://stackoverflow.com/questions/5006821/nodejs-how-to-read-keystrokes-from-stdin
 - http://blog.soulserv.net/terminal-friendly-application-with-node-js-part-iii-user-inputs/

### GPU

 - https://www.reddit.com/r/EmuDev/comments/4tpmop/the_overlap_in_the_tile_data_region_in_the_game/
 - https://forums.nesdev.com/viewtopic.php?f=20&t=17754
 - http://blog.kevtris.org/blogfiles/Nitty%20Gritty%20Gameboy%20VRAM%20Timing.txt

### Testing

 - See blarg's test ROM https://github.com/taisel/GameBoy-Online
 - https://www.reddit.com/r/emulation/comments/2nmslr/android_gbgbc_emulator_accuracy_testing_results/
 - https://gekkio.fi/blog/2016-10-10-game-boy-test-rom-dos-and-donts.html
 - http://gbdev.gg8.se/wiki/articles/Test_ROMs
 - https://github.com/Gekkio/mooneye-gb/blob/master/docs/accuracy.markdown
 - https://realboyemulator.wordpress.com/2013/01/03/a-look-at-the-game-boy-bootstrap-let-the-fun-begin/ 
 - https://mgba.io/2017/05/29/holy-grail-bugs/
 - https://mgba.io/2018/03/09/holy-grail-bugs-revisited/
 
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


Window
When the window is displayed, the window x-coordinate register (register WX, address 0xFF4B) must be set in the
range 7-165. A setting of 0-6 or 166 is prohibited. Specifying a value of 167 or greater causes the window not to be
displayed.
