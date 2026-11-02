---
name: store-design
description: Ajuste layout, temas, imagens e animações da loja usando seus tokens e componentes existentes.
---

# Design da loja

[English](SKILL.md)

- Reutilize a UI atual antes de introduzir outro componente ou padrão visual. Mantenha o catálogo e as ações principais fáceis de identificar.
- Edite as cores dos temas em `app/themes.css` como cores CSS completas; veja a função dos tokens em `THEMING.pt-BR.md`. `app/globals.css` faz o mapeamento pelo `@theme inline` do Tailwind. Defina novas cores nos dois temas; a geometria compartilhada fica em `globals.css`/`tailwind.config.ts`.
- Verifique o layout mobile em 320 px e depois tablet/desktop. Preserve proporções das imagens, legibilidade do português, foco por teclado e alvos de toque. Evite rolagem horizontal da página.
- Use `components/ui/SafeImage.tsx` e as regras de host de `lib/images.ts`. Preserve o fallback local e as dimensões reservadas quando uma miniatura remota falhar.
- Animações usam `MotionProvider`, `m.*` e `lib/motion.ts`. Respeite movimento reduzido e prefira transform/opacity. HTML inicial e primeiro render do cliente devem coincidir, com hero e primeiros cards visíveis.
- Reutilize o diálogo e os controles de tema existentes. Preserve teclado/foco do diálogo nativo e evite efeitos que escondam conteúdo ou aumentem o custo de renderização sem benefício claro.

Para alterações visuais, rode os testes de navegador pertinentes sobre uma exportação atualizada, inspecione as capturas e confira os dois temas. Amplie a cobertura de tamanhos/estados apenas quando a alteração exigir.
