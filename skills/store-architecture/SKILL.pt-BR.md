---
name: store-architecture
description: Preserve as fronteiras dos módulos, o estado na URL e a exportação estática ao alterar rotas, fluxo de dados ou hospedagem da loja.
---

# Arquitetura da loja

[English](SKILL.md)

- Preserve o fluxo: manifesto do GitHub → mapeamento em `services/` → assets de `domain/` → páginas estáticas → filtros/detalhes no navegador.
- Requisições e formatos do backend pertencem a `services/`. A UI importa a entrada pública `@/services`; use imports apenas de tipos quando apropriado. Mantenha o domínio independente de React e Next.js.
- Gere as páginas com os dados tratados de `storeRepository.getSnapshot()`. Não introduza `cookies()`, `headers()`, `connection()`, server actions ou consultas de catálogo por requisição na exportação estática.
- `lib/paths.ts` centraliza `/store`; as rotas de idioma são `/en/` e `/pt-br/` sob esse prefixo. Pré-gere novos segmentos dinâmicos com `generateStaticParams`.
- Mantenha `q`, `category`, `sort`, `page`, `perPage` e `pkg` na URL. Use `lib/navigation.ts` para alterar a consulta; abrir um pacote adiciona histórico, fechá-lo preserva filtros e funciona com Voltar do navegador.
- Novos pacotes aparecem após outro build. O cache em memória dos serviços não atualiza o site publicado. Mantenha `npm start` servindo `out/`, sem usar `next start`.
- Prefira o snapshot existente para este catálogo. Introduza API, abstração ou dependência apenas com uma necessidade concreta. Registre melhorias futuras em `ARCHITECTURE_REVIEW.md`.

Ao alterar rotas/fluxo de dados, verifique tipos, build e os testes de navegação afetados. Preserve os primeiros cards no HTML exportado e a falha de build quando o catálogo estiver indisponível.
