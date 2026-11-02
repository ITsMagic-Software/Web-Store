---
name: store-i18n
description: Atualize textos de interface, rotas de idioma, metadados ou datas de forma consistente em inglês e português brasileiro.
---

# Traduções da loja

[English](SKILL.md)

- Textos de interface, rótulos de acessibilidade e metadados pertencem a `locales/en.json` e `locales/pt-BR.json`, com chaves correspondentes. Prefira textos naturais a traduções palavra por palavra.
- Use `useApp().t` na UI cliente e `getDictionary(locale)` nos demais casos. O helper atual aceita interpolação `{name}`, não plurais ICU; não introduza sintaxe incompatível nem outra biblioteca de i18n para editar textos.
- Diferencie o locale de dicionário `pt-BR` do segmento de rota `pt-br`. Reutilize `lib/i18n.ts` e `lib/paths.ts`; preserve `/store` e os parâmetros da consulta ao mudar o idioma.
- Títulos, descrições e autores do manifesto permanecem no idioma original. Traduza a interface ao redor, não o conteúdo dos pacotes.
- Formate datas com locale explícito e UTC por `lib/date.ts`; evite diferenças entre servidor e cliente.
- A documentação usa entradas em inglês e versões `.pt-BR.md` correspondentes. Mantenha nomes de arquivos, comandos, identificadores e caminhos em inglês; tags de idioma seguem sua grafia padrão. Leia apenas um idioma de cada documento de instruções.

Execute `npm run i18n:check` após alterar dicionários. Confira layouts afetados por textos maiores em português; alterações de idioma/navegação também exigem o teste de navegador pertinente.
