export type ColorSwatch = {
  name: string
  color: string
}

export type ColorPaletteId =
  | "basic"
  | "rainbow"
  | "pastel"
  | "neon"
  | "primary"
  | "secondary"
  | "warm"
  | "cool"
  | "crayon"
  | "paint"
  | "html"
  | "css"
  | "hex"
  | "random"

export const COLOR_PICKER_PALETTES: Record<ColorPaletteId, readonly ColorSwatch[]> = {
  basic: [
    { name: "Red", color: "#E53935" },
    { name: "Orange", color: "#FB8C00" },
    { name: "Yellow", color: "#FDD835" },
    { name: "Green", color: "#43A047" },
    { name: "Blue", color: "#1E88E5" },
    { name: "Purple", color: "#8E24AA" },
    { name: "Pink", color: "#EC407A" },
    { name: "Brown", color: "#6D4C41" },
    { name: "Black", color: "#212121" },
    { name: "White", color: "#FAFAFA" },
  ],
  rainbow: [
    { name: "Red", color: "#FF0000" },
    { name: "Orange", color: "#FF7F00" },
    { name: "Yellow", color: "#FFFF00" },
    { name: "Green", color: "#00FF00" },
    { name: "Blue", color: "#0000FF" },
    { name: "Indigo", color: "#4B0082" },
    { name: "Violet", color: "#9400D3" },
  ],
  pastel: [
    { name: "Pastel Pink", color: "#FFD1DC" },
    { name: "Pastel Peach", color: "#FFDAB9" },
    { name: "Pastel Yellow", color: "#FFF5BA" },
    { name: "Pastel Mint", color: "#B5EAD7" },
    { name: "Pastel Blue", color: "#C7CEEA" },
    { name: "Pastel Lilac", color: "#E2D1F9" },
    { name: "Pastel Coral", color: "#FFB7B2" },
    { name: "Pastel Sage", color: "#D4E6C3" },
  ],
  neon: [
    { name: "Neon Pink", color: "#FF10F0" },
    { name: "Neon Green", color: "#39FF14" },
    { name: "Neon Blue", color: "#1B03A3" },
    { name: "Neon Yellow", color: "#CCFF00" },
    { name: "Neon Orange", color: "#FF5F1F" },
    { name: "Neon Cyan", color: "#00FFFF" },
    { name: "Neon Purple", color: "#BC13FE" },
    { name: "Neon Red", color: "#FF073A" },
  ],
  primary: [
    { name: "Red", color: "#E53935" },
    { name: "Yellow", color: "#FDD835" },
    { name: "Blue", color: "#1E88E5" },
  ],
  secondary: [
    { name: "Orange", color: "#FB8C00" },
    { name: "Green", color: "#43A047" },
    { name: "Purple", color: "#8E24AA" },
  ],
  warm: [
    { name: "Crimson", color: "#DC143C" },
    { name: "Scarlet", color: "#FF2400" },
    { name: "Orange", color: "#FF8C00" },
    { name: "Amber", color: "#FFBF00" },
    { name: "Gold", color: "#FFD700" },
    { name: "Coral", color: "#FF7F50" },
    { name: "Tomato", color: "#FF6347" },
    { name: "Maroon", color: "#800000" },
  ],
  cool: [
    { name: "Sky Blue", color: "#87CEEB" },
    { name: "Dodger Blue", color: "#1E90FF" },
    { name: "Teal", color: "#008080" },
    { name: "Sea Green", color: "#2E8B57" },
    { name: "Mint", color: "#3EB489" },
    { name: "Indigo", color: "#4B0082" },
    { name: "Slate Blue", color: "#6A5ACD" },
    { name: "Cyan", color: "#00BCD4" },
  ],
  crayon: [
    { name: "Scarlet", color: "#FD0E35" },
    { name: "Sunset Orange", color: "#FE4C40" },
    { name: "Sunglow", color: "#FFCC33" },
    { name: "Granny Smith Apple", color: "#9DE093" },
    { name: "Sky Blue", color: "#76D7EA" },
    { name: "Orchid", color: "#E29CD2" },
    { name: "Carnation Pink", color: "#FFA6C9" },
    { name: "Timberwolf", color: "#D9D6CF" },
    { name: "Sepia", color: "#9E5B40" },
    { name: "Midnight Blue", color: "#1A4876" },
  ],
  paint: [
    { name: "Cadmium Red", color: "#E30022" },
    { name: "Cadmium Yellow", color: "#FFF600" },
    { name: "Ultramarine", color: "#3F00FF" },
    { name: "Phthalo Green", color: "#123524" },
    { name: "Burnt Sienna", color: "#E97451" },
    { name: "Raw Umber", color: "#826644" },
    { name: "Titanium White", color: "#F3F3F3" },
    { name: "Ivory Black", color: "#1B1B1B" },
  ],
  html: [
    { name: "Tomato", color: "#FF6347" },
    { name: "Gold", color: "#FFD700" },
    { name: "LimeGreen", color: "#32CD32" },
    { name: "DeepSkyBlue", color: "#00BFFF" },
    { name: "MediumOrchid", color: "#BA55D3" },
    { name: "HotPink", color: "#FF69B4" },
    { name: "Chocolate", color: "#D2691E" },
    { name: "SteelBlue", color: "#4682B4" },
    { name: "DarkSlateGray", color: "#2F4F4F" },
    { name: "WhiteSmoke", color: "#F5F5F5" },
  ],
  css: [
    { name: "rebeccapurple", color: "#663399" },
    { name: "cornflowerblue", color: "#6495ED" },
    { name: "mediumseagreen", color: "#3CB371" },
    { name: "lightcoral", color: "#F08080" },
    { name: "khaki", color: "#F0E68C" },
    { name: "lightsalmon", color: "#FFA07A" },
    { name: "darkturquoise", color: "#00CED1" },
    { name: "orchid", color: "#DA70D6" },
    { name: "dimgray", color: "#696969" },
    { name: "ghostwhite", color: "#F8F8FF" },
  ],
  hex: [
    { name: "#FF5733", color: "#FF5733" },
    { name: "#33FF57", color: "#33FF57" },
    { name: "#3357FF", color: "#3357FF" },
    { name: "#F1C40F", color: "#F1C40F" },
    { name: "#9B59B6", color: "#9B59B6" },
    { name: "#1ABC9C", color: "#1ABC9C" },
    { name: "#E74C3C", color: "#E74C3C" },
    { name: "#34495E", color: "#34495E" },
  ],
  random: [
    { name: "Crimson", color: "#DC143C" },
    { name: "Amber", color: "#FFBF00" },
    { name: "Emerald", color: "#50C878" },
    { name: "Azure", color: "#007FFF" },
    { name: "Violet", color: "#8F00FF" },
    { name: "Magenta", color: "#FF00FF" },
    { name: "Teal", color: "#008080" },
    { name: "Coral", color: "#FF7F50" },
    { name: "Navy", color: "#001F3F" },
    { name: "Lime", color: "#BFFF00" },
    { name: "Rose", color: "#FF007F" },
    { name: "Slate", color: "#708090" },
  ],
}

export function getColorPickerPalette(id: ColorPaletteId): readonly ColorSwatch[] {
  return COLOR_PICKER_PALETTES[id]
}
