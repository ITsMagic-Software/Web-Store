# Cores dos temas

[English](THEMING.md) · [README](README.pt-BR.md)

Edite **[app/themes.css](app/themes.css)**. `:root` define o tema claro; `.dark` substitui os valores no tema escuro.
As declarações estão agrupadas e cada uma tem uma descrição curta. Use o seletor de cores do editor
ou informe uma cor CSS completa: `#BD5205`, `rgb(189 82 5)` ou `hsl(25 95% 38%)`.
Canais HSL isolados, como `25 95% 38%`, não são mais o formato dos tokens.

## Alterações comuns

| Para alterar… | Edite… |
| --- | --- |
| Fundo da página | `--background` |
| Cards, busca, menus e controles | `--surface` |
| Texto principal | `--foreground` |
| Descrições e textos secundários | `--muted-foreground` |
| Botão principal do pacote | `--accent` e `--accent-foreground` |
| Bordas e divisórias | `--divider` |
| Borda do card ao passar o cursor | `--card-hover-border` |
| Decoração do hero | `--hero-glow` e `--glow` |

Por exemplo, para usar um destaque azul, atualize estas declarações nos blocos existentes:

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

Por padrão, `--ring` acompanha `--accent` e `--border` acompanha `--divider`, então essas alterações
também atualizam o foco e as bordas padrão. Substitua uma referência por uma cor para personalizá-la separadamente.
O brilho do hero tem uma cor própria; altere também `--hero-glow` para acompanhar um novo destaque.

## Referência das variáveis

| Variável | Função |
| --- | --- |
| `--background` | Fundo da página e superfície principal do modal. |
| `--foreground` | Textos principais, títulos, ícones e botões/filtros ativos de preenchimento neutro. |
| `--surface` | Cards, campos, menus e barras de ações. Componentes podem aplicar transparência. |
| `--surface-elevated` | Campos em foco e superfícies elevadas. |
| `--muted` | Fundos de hover, tags e placeholders de carregamento. |
| `--muted-foreground` | Descrições, quantidade de resultados, metadados e ícones secundários. |
| `--divider` | Divisórias e contornos dos componentes. |
| `--border` | Utilitário de borda padrão; usa `--divider`. |
| `--card-hover-border` | Borda do card no hover, independente dos textos. Inclui opacidade: `#FB985180` é translúcido; `#FB9851` é opaco. |
| `--accent` | Ação principal do pacote e cor de destaque da marca. |
| `--accent-foreground` | Texto/ícones sobre o destaque; preserve contraste legível. |
| `--ring` | Indicador de foco por teclado; usa `--accent`. |
| `--hero-glow` | Cor base do brilho atrás do título do hero. |
| `--glow` | Cor translúcida derivada de `--hero-glow`; controla o halo externo mais suave. |
| `--destructive` | Reservada para estados de erro/ações destrutivas. |
| `--success` | Reservada para estados de sucesso. |
| `--warning` | Reservada para estados de aviso. |
| `--shadow-sm` | Sombras discretas de controles/cards; valor CSS completo de sombra. |
| `--shadow-md` | Sombra de painéis/menus flutuantes; valor CSS completo de sombra. |
| `--thumb-1` | Gradiente azul de fallback de miniaturas. |
| `--thumb-2` | Gradiente ciano de fallback de miniaturas. |
| `--thumb-3` | Gradiente verde de fallback de miniaturas. |
| `--thumb-4` | Gradiente areia de fallback de miniaturas. |
| `--thumb-5` | Gradiente roxo de fallback de miniaturas. |
| `--thumb-6` | Gradiente rosa de fallback de miniaturas. |

Os seis gradientes são escolhidos pelo ID do asset quando a imagem está ausente ou falha.
O tema escuro os herda, a menos que você acrescente substituições em `.dark`. Edite as cores dentro
de `linear-gradient(...)` para alterá-los; mantenha `--glow` como cor completa e as sombras como valores completos de sombra.

## Estilizar componentes

`app/globals.css` importa a paleta e a conecta ao Tailwind por `@theme inline`.
Use classes existentes como `bg-surface`, `text-foreground`, `border-divider` e `bg-accent/90`.
As variantes de transparência e as cores derivadas de grades, sobreposição e hover acompanham a paleta automaticamente.
Evite cores fixas nos componentes e não edite os mapeamentos `--color-*` para trocar a paleta.

Os valores `--radius-*` em `globals.css` controlam cantos, não cores. Os valores `--font-*`
controlam a tipografia. Para uma nova cor semântica, defina-a nos dois temas, adicione seu mapeamento
no Tailwind e documente-a nas duas versões deste guia.

Visualize com `npm run dev` em `/store/`. Confira ambos os temas, legibilidade dos textos nas superfícies/botões,
indicadores de foco, miniaturas e sobreposição do modal antes de versionar uma mudança de paleta.
