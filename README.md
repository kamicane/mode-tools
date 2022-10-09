# mode-tools

command line mode calculator, parser, converter and analyzer

## Usage

- git clone this repo
- `npm i --production`
- `sudo npm link`
- copy the example spec-X.yml somewhere convenient
- `mode-tools --help`
- `mode-tools calc --help`

### Examples

Calculate a 320x240 modeline for 15khz monitors

`./mode-tools.js calc 320 240 60 --spec path/to/spec-15khz.yml`

Calculate 1280x576@59.7 using KHz pixel clock precision (MiSter uses KHz), for 30khz monitors

`./mode-tools.js calc 1280 576 59.7 --pixel-clock-precision 1000 --spec path/to/spec-30khz.yml`

## Warning

I take no responsibility if you fry your CRT
