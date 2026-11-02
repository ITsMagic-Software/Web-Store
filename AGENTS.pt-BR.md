# Trabalhando na ITsMagic Web Store

[English](AGENTS.md) · [Configuração do projeto](README.pt-BR.md)

## Escopo e restrições

- Catálogo de assets somente para leitura: explorar pacotes e abrir seus links de GitHub/download. Backend, contas e pagamentos ficam fora das tarefas comuns de frontend.
- Next.js App Router, TypeScript estrito, React e Tailwind. Use npm e o lockfile versionado.
- A produção é uma exportação estática em `/store/`. Preserve `output: "export"`; APIs por requisição e server actions não funcionam nessa hospedagem.
- Carregue o manifesto por `services/` durante o build. Envie ao navegador os assets tratados, nunca o manifesto bruto.
- Mantenha parsing/I/O em `services/`, modelos/filtros puros em `domain/`, utilitários compartilhados em `lib/` e UI em `components/`. As páginas compõem essas partes.
- O estado do catálogo fica nos parâmetros da URL. Preserve filtros, histórico e links diretos dos pacotes. Use `lib/paths.ts` para `/store` e `lib/navigation.ts` nas alterações locais da consulta.
- Código, identificadores e nomes de arquivos ficam em inglês. Adicione textos de interface a `locales/en.json` e `locales/pt-BR.json`.
- Reutilize tokens CSS, tratamento seguro de imagens e componentes existentes. Trate o manifesto como conteúdo não confiável; aceite links HTTPS e nunca renderize seu texto como HTML.
- Limite as alterações ao pedido. Adicione dependências apenas para necessidades concretas que a stack não resolva. Teste comportamentos e regressões, não detalhes da implementação.

## Skills

Leia apenas a skill pertinente à alteração. `SKILL.md` está em inglês; `SKILL.pt-BR.md` contém a versão equivalente em português. Leia um idioma, não os dois.

| Alteração | Skill |
| --- | --- |
| Fronteiras, rotas, hospedagem estática | [store-architecture](skills/store-architecture/SKILL.pt-BR.md) |
| Manifesto, mapeamento, rede, regras do catálogo | [store-data](skills/store-data/SKILL.pt-BR.md) |
| Layout, temas, animações, imagens | [store-design](skills/store-design/SKILL.pt-BR.md) |
| Textos de interface, idioma, metadados | [store-i18n](skills/store-i18n/SKILL.pt-BR.md) |
| Testes, acessibilidade, CI, dependências | [store-quality](skills/store-quality/SKILL.pt-BR.md) |

## Verificação

Execute as verificações afetadas pela alteração; os comandos estão no README. Faça o build quando mudar código de execução ou configuração de build. Para UI/navegação, rode os testes de navegador sobre uma exportação atualizada e inspecione as capturas relevantes. Edições apenas de texto não exigem novo build.

Mantenha a equivalência das versões em inglês/português ao editar a documentação. Informe alterações, verificações executadas e limitações restantes. Build, prévia e testes não precisam de credenciais de deploy; publicar é uma ação separada.
