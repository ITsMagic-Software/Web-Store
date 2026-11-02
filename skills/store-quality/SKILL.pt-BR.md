---
name: store-quality
description: Escolha verificações focadas para alterações da loja em testes, acessibilidade, CI, dependências ou configuração de publicação.
---

# Qualidade da loja

[English](SKILL.md)

- Teste comportamentos observáveis: decodificação/datas do manifesto, filtros/paginação, segurança/fallback de imagens, URL/histórico e erros de deploy. Use fixtures pequenas e evite asserções que copiem a implementação ou dependam de textos visuais exatos.
- Use Vitest para funções/componentes, Playwright para navegação/layout e Python unittest para `tools/deploy.py`. Testes ficam em `tests/`; ferramentas reutilizáveis ficam em `tools/`, não dentro das skills.
- Mantenha cobertura representativa no navegador. Os três casos de layout cobrem mobile/tablet/desktop, ambos os temas e movimento reduzido; adicione casos apenas para riscos distintos. Capturas servem para inspeção, não como baselines de pixels.
- Preserve navegação por teclado, foco/fechamento de diálogos, foco visível, rótulos traduzidos úteis e fallback de imagens. Não declare auditoria WCAG/performance sem tê-la executado.
- Execute as verificações afetadas com os comandos do README. Alterações de código/build exigem exportação atualizada antes dos testes de navegador; edições apenas de texto não exigem build. Rode lint/tipos ao mudar arquivos executáveis ou suas configurações.
- Mantenha testes de manifesto/rede determinísticos. Os testes de navegador usam o catálogo exportado e precisam de build bem-sucedido e pacotes disponíveis.
- O CI valida tipos, lint, testes unitários, testes do script de deploy, traduções e build. Mantenha credenciais fora das verificações locais e artefatos gerados fora do Git.
- Revise dependências e alertas de auditoria individualmente; não force atualizações/downgrades apenas para zerar um relatório. Informe verificações e limitações com precisão.
