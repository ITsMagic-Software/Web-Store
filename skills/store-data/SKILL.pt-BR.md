---
name: store-data
description: Altere carregamento, decodificação, mapeamento, filtros ou tratamento de erros do manifesto sem expor dados brutos do backend à UI.
---

# Dados da loja

[English](SKILL.md)

- Leia o mapper existente e o payload real antes de mudar campos. A origem é `ITsMagic-Software/Packages-Manifest`; as opções de endpoint ficam em `services/endpoints.ts`.
- Faça requisições por `services/shared/httpClient.ts`. Preserve timeout, retentativas e fallback de gzip para JSON; mantenha requisições fora dos componentes.
- Apenas assets compatíveis com v2 entram no catálogo. Decodifique `titleB64`, `descriptionB64`, `licenseB64` e valores prefixados no mapper. Preserve UTF-8, o limite de três camadas e o tratamento de valores malformados.
- Use `lib/date.ts` para parsing estrito de `dd/MM/yyyy` ou `yyyy-MM-dd` em UTC. Datas inválidas ficam por último; a ordem padrão é da mais recente para a mais antiga.
- Preserve a validação de URLs HTTPS no mapper e de hosts de imagens em `lib/images.ts`. Ignore itens individuais inválidos com contadores observáveis; um envelope inválido não deve virar silenciosamente um catálogo vazio bem-sucedido.
- Mantenha busca sem distinção de acentos, categorias, ordenação estável e paginação limitada em `domain/catalog.ts`. Não altere o snapshot recebido.
- Preserve a distinção dos serviços entre indisponível e pronto/vazio. Não transforme falhas de rede em sucesso vazio nem exponha payloads brutos nos logs.

Execute `tests/manifest.test.ts` e `tests/catalog.test.ts` ao alterar mapeamento/catálogo. Adicione casos apenas para uma regra nova ou falha demonstrada; documente lacunas conhecidas em vez de apresentá-las como implementadas.
