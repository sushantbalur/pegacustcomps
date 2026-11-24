---
title: Build a data-driven widget with loading, empty and error states
keywords: [widget, data page, getDataApiUtils, getData, loading state, empty state, error state, retry, localization, useEffect]
primary_methods: [DataApiUtils.getData, PConnect.getContextName, LocalizationService.getLocalizedText]
related: [field-with-limits-and-validation]
---

# Recipe: Build a data-driven widget with loading, empty and error states

> Part of the [Component Authoring cookbook](./README.md) — [skill overview](../SKILL.md).

## Problem

A page needs a panel that lists rows from a data page (for example the operator's open work). The data page and the number of rows must be configurable. The panel must show a loading indicator, an empty message when there is nothing to show, and an error with a retry button when the request fails.

## Solution

**1. Scaffold a page widget** (run `npm run createLib -- Lib 1.0.0 Y Current` first in a new project):

```bash
npm run create -- Widget PAGE WorkPanel "Work panel" 1.0.0 Lib "Panel listing open work" Acme
```

**2. Replace `properties` in `config.json`** so a designer can choose the title, data page and row count:

```json
"properties": [
  { "name": "title", "label": "Title", "format": "TEXT", "defaultValue": "Work list" },
  { "name": "dataPage", "label": "Data page", "format": "TEXT", "defaultValue": "D_pyMyWorkList" },
  { "name": "pageSize", "label": "Rows to show", "format": "NUMBER", "defaultValue": 10 },
  {
    "label": "Conditions",
    "format": "GROUP",
    "properties": [{ "name": "visibility", "label": "Visibility", "format": "VISIBILITY" }]
  }
]
```

**3. Write `index.tsx`:**

```tsx
import { useCallback, useEffect, useState } from 'react';
import { withConfiguration, Table, EmptyState, ErrorState } from '@pega/cosmos-react-core';
import type { PConnFieldProps } from '../shared/PConnProps';
import '../shared/create-nonce';

import StyledAcmeLibWorkPanelWrapper from './styles';

interface AcmeLibWorkPanelProps extends PConnFieldProps {
  title?: string;
  dataPage?: string;
  pageSize?: number | string;
}

interface WorkRow {
  id: number;
  caseType: string;
  status: string;
  stage: string;
}

type LoadState = 'loading' | 'ready' | 'error';

function AcmeLibWorkPanel(props: AcmeLibWorkPanelProps) {
  const { getPConnect, title = 'Work list', dataPage = 'D_pyMyWorkList', pageSize = 10 } = props;
  const pConn = getPConnect();
  const context = pConn.getContextName();
  const localize = (text: string) => pConn.getLocalizationService().getLocalizedText(text);

  const [rows, setRows] = useState<WorkRow[]>([]);
  const [state, setState] = useState<LoadState>('loading');
  const [attempt, setAttempt] = useState(0);
  const size = Number.parseInt(String(pageSize), 10) || 10;

  useEffect(() => {
    let cancelled = false;
    setState('loading');

    PCore.getDataApiUtils()
      .getData(dataPage, { paging: { pageNumber: 1, pageSize: size } }, context)
      .then((response: any) => {
        if (cancelled) return;
        const data: any[] = response?.data?.data ?? [];
        setRows(
          data.map((entry, index) => ({
            id: index,
            caseType: entry.pxProcessName,
            status: entry.pyAssignmentStatus,
            stage: entry.pxTaskLabel
          }))
        );
        setState('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setRows([]);
        setState('error');
      });

    // ignore a response that arrives after the component unmounted or the inputs changed
    return () => {
      cancelled = true;
    };
  }, [context, dataPage, size, attempt]);

  const retry = useCallback(() => setAttempt((count) => count + 1), []);

  if (state === 'error') {
    return (
      <StyledAcmeLibWorkPanelWrapper>
        <ErrorState message={localize('Unable to load work')} onRetry={retry} />
      </StyledAcmeLibWorkPanelWrapper>
    );
  }

  if (state === 'ready' && rows.length === 0) {
    return (
      <StyledAcmeLibWorkPanelWrapper>
        <EmptyState message={localize('No work found')} />
      </StyledAcmeLibWorkPanelWrapper>
    );
  }

  const columns: { renderer: keyof WorkRow; label: string }[] = [
    { renderer: 'caseType', label: localize('Case type') },
    { renderer: 'status', label: localize('Status') },
    { renderer: 'stage', label: localize('Stage') }
  ];

  return (
    <StyledAcmeLibWorkPanelWrapper>
      <Table
        title={localize(title)}
        columns={columns}
        data={rows}
        loading={state === 'loading'}
        loadingMessage={localize('Loading work')}
      />
    </StyledAcmeLibWorkPanelWrapper>
  );
}

export default withConfiguration(AcmeLibWorkPanel);
```

**4. Add every user-visible string to `localizations.json`** under `fields`:

```json
{
  "fields": {
    "Case type": "Case type",
    "Status": "Status",
    "Stage": "Stage",
    "Work list": "Work list",
    "Loading work": "Loading work",
    "No work found": "No work found",
    "Unable to load work": "Unable to load work"
  }
}
```

**5. Replace `mock.ts`, `demo.stories.tsx` and `demo.test.tsx`.** The story fakes only `PCore.getDataApiUtils().getData` and the two `pConn` methods the widget calls. Three stories drive the three states:

```ts
// mock.ts
export const configProps = { title: 'Open work', dataPage: 'D_pyMyWorkList', pageSize: 10 };

export const workListData = {
  data: {
    data: [
      { pxProcessName: 'Loan request', pyAssignmentStatus: 'Open', pxTaskLabel: 'Review' },
      { pxProcessName: 'Service request', pyAssignmentStatus: 'Pending', pxTaskLabel: 'Approve' }
    ]
  }
};
```

```tsx
// demo.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';

import AcmeLibWorkPanel from './index';
import { configProps, workListData } from './mock';

const meta: Meta<typeof AcmeLibWorkPanel> = {
  title: 'AcmeLibWorkPanel',
  component: AcmeLibWorkPanel,
  excludeStories: /.*Data$/
};

export default meta;
type Story = StoryObj<typeof AcmeLibWorkPanel>;

// Fake only the PCore function the component calls.
const mockGetData = (getData: () => Promise<unknown>) => {
  (globalThis as unknown as { PCore: unknown }).PCore = { getDataApiUtils: () => ({ getData }) };
};

const getPConnect = () =>
  ({
    getContextName: () => 'app/primary_1',
    getLocalizationService: () => ({ getLocalizedText: (text: string) => text })
  }) as any;

const renderPanel = (getData: () => Promise<unknown>) => {
  const Render: Story = (args: any) => {
    mockGetData(getData);
    return <AcmeLibWorkPanel getPConnect={getPConnect} {...args} />;
  };
  Render.args = { ...configProps };
  return Render;
};

export const BaseAcmeLibWorkPanel = renderPanel(() => Promise.resolve(workListData));
export const EmptyAcmeLibWorkPanel = renderPanel(() => Promise.resolve({ data: { data: null } }));
export const ErrorAcmeLibWorkPanel = renderPanel(() => Promise.reject(new Error('Network error')));
```

```tsx
// demo.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import '@testing-library/jest-dom';

import * as DemoStories from './demo.stories';
import { workListData } from './mock';

const { BaseAcmeLibWorkPanel, EmptyAcmeLibWorkPanel, ErrorAcmeLibWorkPanel } = composeStories(DemoStories);

test('shows the loading message, then the rows', async () => {
  render(<BaseAcmeLibWorkPanel />);
  expect(screen.getByText('Loading work')).toBeVisible();

  expect(await screen.findByText('Loan request')).toBeVisible();
  expect(screen.getByText('Service request')).toBeVisible();
  expect(screen.getByText('Case type')).toBeVisible();
  expect(screen.queryByText('Loading work')).toBeNull();
});

test('shows the empty state when the data page returns no rows', async () => {
  render(<EmptyAcmeLibWorkPanel />);
  expect(await screen.findByText('No work found')).toBeVisible();
});

test('shows an error and recovers when the user retries', async () => {
  render(<ErrorAcmeLibWorkPanel />);
  expect(await screen.findByText('Unable to load work')).toBeVisible();

  // the next request succeeds
  (globalThis as unknown as { PCore: { getDataApiUtils: () => unknown } }).PCore.getDataApiUtils = () => ({
    getData: () => Promise.resolve(workListData)
  });
  fireEvent.click(screen.getByRole('button', { name: /try again/i }));

  expect(await screen.findByText('Loan request')).toBeVisible();
});
```

**6. Run the check loop** from [cli-workflow.md](../references/cli-workflow.md):

```bash
npx jest src/components/Acme_Lib_WorkPanel --coverage=false
npx tsc --noEmit 2>&1 | grep -v "demo.stories.tsx"
npm run validate-schema -- Acme_Lib_WorkPanel
npm run buildComponent -- Acme_Lib_WorkPanel N N
```

## Discussion

- **MUST** handle all four outcomes of the request: pending, rows, no rows (`response.data.data` is `null` or empty) and failure. A widget that handles only the success path shows an empty table forever when the call fails.
- **MUST** guard against a stale response. The `cancelled` flag in the effect cleanup stops a late response from updating state after the component unmounts or `dataPage`/`context` change.
- Keep the effect dependencies to the inputs that should trigger a reload (`context`, `dataPage`, the page size and a retry counter). Putting `pConn` or a freshly created object in the dependency list reloads on every render. See [performance-and-efficiency.md](../../best-practices/performance-and-efficiency.md).
- `getData(dataViewName, payload?, context?, options?)` is documented in [pcore-rest-data-details.md](../../references/pcore-rest-data-details.md). `getContextName()` is in [pconnect-reference-context-component.md](../../references/pconnect-reference-context-component.md) and `getLocalizedText` in [pconnect-case-info-data-info-localization.md](../../references/pconnect-case-info-data-info-localization.md).
- `ErrorState` renders its retry button with the design system's own text ("Try again"). Query it by role and name in tests.
- In the story, assign `PCore` through `globalThis` instead of `window.PCore = ...`. The `globals.d.ts` in the project declares `PCore` as a global constant, so the scaffolded `window.PCore` assignments produce `tsc` errors.
- If the widget must call a REST endpoint instead of a data page, see [pcore-rest-data-details.md](../../references/pcore-rest-data-details.md) and the [error handling guide](../../best-practices/error-handling-and-resiliency.md).

## Related recipes

- [Customize a field with limits, a counter and validation messages](./field-with-limits-and-validation.md)
- [Subscribe to data page changes](../../pconnect-data-subscriptions/SKILL.md)
