# Styles Pattern (`styles.ts`)

> Part of the [create-dx-component skill](../SKILL.md).

## Required shape


```typescript
import styled, { css } from 'styled-components';

export default styled.div(() => {
  return css`
    margin: 0px 0;
  `;
});
```

- Default-export a single `styled.div`.
- Import both `styled` and `css`.
- Consume it in `index.tsx` as `StyledWrapper` wrapping the component's return value.

## Styled-components are a LAST RESORT


The canonical rule lives in [AGENTS.md](../../../../AGENTS.md). What it means *in this file* — the concrete allow and deny lists:

Legitimate uses:

- keyframe animations, `transform`, `transition`
- hover/focus/drag states Cosmos does not expose
- SVG and canvas styling
- a positional override Cosmos props cannot express

Never write rules here for:

- layout — use `Flex` or `Grid`
- cards and panels — use `Card`, `CardHeader`, `CardContent`
- typography, sizing, or colour of text — use `Text` variants
- badges and pills — use `Status`, `Tag`, `Count`
- loading and empty states — use `Progress`, `EmptyState`

## Other rules


- Never use inline `style={{ ... }}` in `index.tsx`. All custom CSS belongs here.
- Target children by class name from inside the wrapper; do not export additional styled components unless `index.tsx` imports each one.
- Every rule must apply to an element that actually renders. Delete selectors for markup that no longer exists — dead CSS is dead code.
- Prefer Cosmos design tokens over hardcoded colours and spacing.

## The theme is not available here

`@pega/cosmos-react-core` bundles its own nested copy of `styled-components`, so `theme.base` is `undefined` in this file and `theme.base.palette` throws. Read the theme in `index.tsx` with `useTheme()` and pass the values in as transient props (`$error`, `$success`). The worked example is in [cosmos-components.md](./cosmos-components.md#styled-components-theme-does-not-cross-the-boundary).

Valid `base.palette` keys include `primary-background`, `secondary-background`, `foreground-color`, `app-background`, `brand-primary`, `urgent`, `warn`, `success`, `pending`, `info`, `interactive`, `border-line`. Props-driven styled components are also the right home for state-driven `transform`, `transition` and animation values, which keeps them out of inline styles.
