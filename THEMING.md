# Theme colors

[Português](THEMING.pt-BR.md) · [README](README.md)

Edit **[app/themes.css](app/themes.css)**. `:root` defines the light theme; `.dark` overrides it for dark mode.
The declarations are grouped and each has a short description. Use the editor's color picker
or enter a complete CSS color: `#BD5205`, `rgb(189 82 5)` or `hsl(25 95% 38%)`.
Bare HSL channels such as `25 95% 38%` are no longer the token format.

## Common changes

| To change… | Edit… |
| --- | --- |
| Page background | `--background` |
| Cards, search, menus and controls | `--surface` |
| Main text | `--foreground` |
| Descriptions and secondary text | `--muted-foreground` |
| Primary package button | `--accent` and `--accent-foreground` |
| Borders and separators | `--divider` |
| Asset card border on hover | `--card-hover-border` |
| Hero decoration | `--hero-glow` and `--glow` |

For example, to use a blue accent, update these declarations in the existing blocks:

```css
:root {
  --accent: #1D4ED8;
  --accent-foreground: #FFFFFF;
}

.dark {
  --accent: #93C5FD;
  --accent-foreground: #172554;
}
```

`--ring` follows `--accent` and `--border` follows `--divider` by default, so these changes
also update focus rings and default borders. Replace an alias with a color to customize it independently.
The hero glow has its own color; change `--hero-glow` too when you want it to match a new accent.

## Token reference

| Variable | Purpose |
| --- | --- |
| `--background` | Page background and the main modal surface. |
| `--foreground` | Primary text, headings, icons and neutral filled buttons/active filters. |
| `--surface` | Cards, inputs, menus and action bars. Components may add transparency. |
| `--surface-elevated` | Focused fields and raised surfaces. |
| `--muted` | Hover backgrounds, tags and loading placeholders. |
| `--muted-foreground` | Descriptions, result count, metadata and secondary icons. |
| `--divider` | Separators and component outlines. |
| `--border` | Default border utility; aliases `--divider`. |
| `--card-hover-border` | Asset card hover border, independent of text colors. Includes opacity: `#FB985180` is translucent; `#FB9851` is opaque. |
| `--accent` | Primary package action and brand accent. |
| `--accent-foreground` | Text/icons on the accent background; maintain readable contrast. |
| `--ring` | Keyboard focus indicator; aliases `--accent`. |
| `--hero-glow` | Base color of the glow behind the hero title. |
| `--glow` | Translucent glow derived from `--hero-glow`; controls the softer outer halo. |
| `--destructive` | Reserved for error/destructive states. |
| `--success` | Reserved for success states. |
| `--warning` | Reserved for warning states. |
| `--shadow-sm` | Subtle shadows on controls/cards; a complete CSS shadow value. |
| `--shadow-md` | Floating panel/menu shadow; a complete CSS shadow value. |
| `--thumb-1` | Blue fallback thumbnail gradient. |
| `--thumb-2` | Cyan fallback thumbnail gradient. |
| `--thumb-3` | Green fallback thumbnail gradient. |
| `--thumb-4` | Sand fallback thumbnail gradient. |
| `--thumb-5` | Purple fallback thumbnail gradient. |
| `--thumb-6` | Rose fallback thumbnail gradient. |

The six thumbnail gradients are selected from the asset ID when an image is missing or fails.
Dark mode inherits them unless you add overrides inside `.dark`. Edit the colors inside
`linear-gradient(...)` to change them; keep `--glow` as a complete color and shadows as complete shadow values.

## Styling components

`app/globals.css` imports the palette and maps it to Tailwind with `@theme inline`.
Use existing classes such as `bg-surface`, `text-foreground`, `border-divider` and `bg-accent/90`.
Their alpha variants and derived grid, overlay and hover colors follow the palette automatically.
Avoid adding fixed colors in components or editing the `--color-*` mappings for a palette change.

The `--radius-*` values in `globals.css` control corner shapes, not colors. `--font-*` values
control typography. For a new semantic color, define it in both themes, add its Tailwind mapping
and document it in both versions of this guide.

Preview with `npm run dev` at `/store/`. Check both themes, readable text on surfaces/buttons,
focus indicators, thumbnails and the modal backdrop before committing a palette change.
