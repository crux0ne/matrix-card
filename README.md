# Matrix Blue Card

A custom Lovelace card for Home Assistant that renders a Matrix-style code rain animation in a blue color theme.

## Features

- Matrix animation optimized for Home Assistant dashboards
- Blue default theme (HA-style)
- Configurable speed, colors, font size and height
- HACS compatible

## Installation

### HACS (recommended)

1. Push this repository to GitHub.
2. In Home Assistant, open HACS.
3. Go to Frontend -> menu (3 dots) -> Custom repositories.
4. Add your repository URL and select category `Dashboard`.
5. Install `Matrix Blue Card`.
6. Restart Home Assistant.

### Manual

1. Copy `matrix-blue-card.js` to `<config>/www/`.
2. Add resource in Home Assistant:
   - URL: `/local/matrix-blue-card.js`
   - Type: `module`
3. Restart Home Assistant.

## Lovelace usage

```yaml
type: custom:matrix-blue-card
height: 240
speed: 1.2
font_size: 16
color: "#03a9f4"
background_color: "#00131f"
trail_alpha: 0.15
characters: "01アイウエオ"
```

## Options

- `height` (number): Card height in px. Default: `220`
- `speed` (number): Drop speed multiplier. Default: `1`
- `font_size` (number): Font size in px. Default: `16`
- `color` (string): Character color. Default: `#03a9f4`
- `background_color` (string): Background fade color. Default: `#00131f`
- `trail_alpha` (number): Fade strength from `0.01` to `1`. Default: `0.15`
- `characters` (string): Characters used in rain effect

## HACS notes

For HACS discovery, make sure the repository topic contains:

- `home-assistant`
- `lovelace`
- `hacs`

## License

MIT
