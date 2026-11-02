# ITsMagic Web Store

[English](README.md) · Português

Catálogo estático de assets para a ITsMagic Engine. Explore, busque e filtre pacotes compatíveis
com v2, veja os detalhes e abra o repositório no GitHub ou o endereço de download do pacote.

[Visitar a loja](https://itsmagic.com.br/store/) · [Manifesto de pacotes](https://github.com/ITsMagic-Software/Packages-Manifest)

## Executar localmente

Requer **Node.js 22.12+** e npm. Python 3.11+ é necessário apenas para as ferramentas de deploy e seus testes.

```sh
npm ci
npm run dev
```

Abra [localhost:3000/store/](http://localhost:3000/store/). A loja oferece inglês, português
brasileiro, temas claro/escuro e links de pacotes que preservam os filtros do catálogo.

## Build e prévia

```sh
npm run build
npm start
```

O build precisa de acesso à rede para o manifesto do GitHub e o Google Fonts. Os arquivos
estáticos são gerados em `out/`; a prévia os serve em `http://localhost:3000/store/`.
Falhas ao buscar o catálogo interrompem o build. Pacotes novos ou atualizados aparecem após outro build/deploy.

## Como funciona

Construído com Next.js App Router, React, TypeScript e Tailwind CSS. Durante o build,
`services/` carrega o manifesto e o transforma em assets compatíveis. O navegador filtra esse snapshot
e guarda busca, categoria, ordenação, paginação e pacote selecionado na URL.
Os links abrem seus destinos HTTPS originais; este projeto não hospeda arquivos de pacotes.
Os detalhes de pacotes do GitHub também oferecem **Baixar ZIP**, servido diretamente pelo GitHub
a partir da branch padrão. É o snapshot atual do código, não uma release fixa ou um build de versão específica.

| Diretório | Responsabilidade |
| --- | --- |
| `app/` | Páginas estáticas, rotas de idioma e estilos globais |
| `components/` | Catálogo, detalhes, controles e fallback de imagens |
| `domain/` | Modelos de assets e seleção pura do catálogo |
| `services/` | Carregamento, decodificação e mapeamento do manifesto |
| `lib/` | Estado na URL, idioma, datas, imagens e utilitários compartilhados |
| `locales/` | Textos da interface em inglês e português brasileiro |
| `tests/`, `tools/` | Verificações focadas, prévia e ferramentas de deploy |
| `skills/` | Instruções específicas por tarefa para contribuidores/agentes nos dois idiomas |

A produção usa `output: "export"` e o prefixo `/store`. É necessário um servidor de arquivos
estáticos, sem executar o servidor do Next.js. Melhorias de arquitetura estão em [ARCHITECTURE_REVIEW.md](ARCHITECTURE_REVIEW.md).

## Configuração

Estas variáveis opcionais são lidas durante o build; navegar ou gerar a loja não exige credenciais.

| Variável | Função / padrão |
| --- | --- |
| `STORE_MANIFEST_BASE_URL` | URL base do manifesto; usa por padrão a branch `main` do repositório original em formato raw |
| `STORE_DATABASE_FORMAT` | `gz` (padrão, com fallback JSON) ou `json` |
| `ASSET_DATABASE_URL` | URL HTTPS direta do manifesto; substitui URL base e formato |

Para adicionar ou atualizar um pacote listado, use o [repositório do manifesto](https://github.com/ITsMagic-Software/Packages-Manifest).
Alterar apenas esta loja não cadastra pacotes.

## Cores dos temas

Edite as paletas clara/escura em [app/themes.css](app/themes.css), usando HEX ou outra cor CSS completa.
O [guia de temas](THEMING.pt-BR.md) explica cada variável de cor e como personalizá-la.

## Verificações

| Comando | Verifica |
| --- | --- |
| `npm run typecheck` | Tipos gerados das rotas e TypeScript |
| `npm run lint` | ESLint |
| `npm test` | Comportamento do manifesto, catálogo e imagens seguras |
| `npm run i18n:check` | Chaves correspondentes e traduções não vazias |
| `python -m unittest discover -s tests -p "test_*.py"` | URL de deploy e tratamento de falhas HTTP, sem upload |
| `npm run test:e2e` | Navegação e verificações representativas de responsividade/temas |

Os testes de navegador exigem build atualizado e Chromium. Instale o navegador uma vez com
`npx playwright install chromium` e execute `npm run build` e `npm run test:e2e`.
O executor inicia a prévia automaticamente. As capturas ficam em `qa-screenshots/`;
relatórios e traces ficam em `test-results/`. Os dois diretórios são ignorados pelo Git.

## Contribuir

Abra uma issue para discutir um problema ou alteração, ou envie um pull request focado com o
problema, a solução e as verificações pertinentes. Leia [AGENTS.pt-BR.md](AGENTS.pt-BR.md) e apenas a skill relevante.
Mantenha código e nomes de arquivos em inglês; atualize os dois dicionários ao mudar textos da interface
e as duas versões ao editar documentação. Prefira testes de regressão de comportamento a casos repetitivos.

## Deploy

Pull requests para `main` executam tipos, lint, testes unitários, testes do script de deploy, traduções e build.
Pushes elegíveis para `main` também enviam `out/` por `tools/deploy.py` usando:

`https://itsmagic.com.br/devtools/updateStore.php`.

O endpoint é mantido fora deste repositório. Forks podem hospedar `out/` em qualquer servidor
estático que o sirva em `/store/`; credenciais de deploy são necessárias apenas para o fluxo original de upload.

## Licença

Este repositório ainda não inclui um arquivo `LICENSE` para a loja. Consulte o repositório de cada
pacote para suas informações de licença; listar um asset não o inclui no código-fonte deste projeto.
