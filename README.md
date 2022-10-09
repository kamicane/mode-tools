# mode-tools

command line mode calculator, parser, converter and analyzer

## Usage

- git clone this repo
- `npm i --production`
- `sudo npm link`
- copy the example spec-X.yml somewhere convenient
- `mode-tools --help`
- `mode-tools calc --help`

### example

this example calculates using KHz pixel clock (for MiSter for example)

./mode-tools.js calc 1280 576 59.7 --pixel-clock-precision 1000 --spec spec-30khz.yml

## warning

I take no responsibility if you fry your CRT
