---
name: store-design
description: Adjust the store's layout, themes, images and motion using its existing tokens and components.
---

# Store design

[Português](SKILL.pt-BR.md)

- Reuse the current UI before introducing a new component or visual pattern. Keep the catalog and primary actions easy to scan.
- Edit theme colors in `app/themes.css` as complete CSS colors; see `THEMING.md` for token roles. `app/globals.css` maps them through Tailwind's `@theme inline`. Define new colors in both themes; shared geometry stays in `globals.css`/`tailwind.config.ts`.
- Check mobile layouts at 320 px, then tablet/desktop. Preserve card image ratios, readable Portuguese text, keyboard focus and touch targets. Avoid horizontal page overflow.
- Use `components/ui/SafeImage.tsx` and the host rules in `lib/images.ts`. Keep the local fallback and reserved image dimensions when a remote thumbnail fails.
- Motion uses `MotionProvider`, `m.*` and `lib/motion.ts`. Respect reduced motion; prefer transform/opacity. Initial HTML and first client render must match, with hero and first cards visible.
- Reuse the existing dialog and theme controls. Preserve native dialog keyboard/focus behavior and avoid adding visual effects that obscure content or increase rendering cost without a clear benefit.

For a visible change, run the relevant browser smoke checks against a fresh export, inspect the screenshots and check both themes. Expand viewport/state coverage only when the change needs it.
