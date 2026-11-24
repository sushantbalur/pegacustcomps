# Component Implementation Patterns

## Field Component Pattern

Field components bind to a single case property and handle input/display with validation.

```typescript
import { Input, withConfiguration } from '@pega/cosmos-react-core';
import type { PConnFieldProps } from '../shared/PConnProps';
import '../shared/create-nonce';
import handleEvent from './event-utils';
import StyledWrapper from './styles';

interface Props extends PConnFieldProps {
  // Additional props from config.json
  hasSuggestions?: boolean;
  variant?: any;
  formatter?: string;
}

interface StateProps {
  value: string;
  hasSuggestions: boolean;
}

function AcmeLibMyField(props: Props) {
  const {
    getPConnect,
    value = '',
    label = '',
    helperText = '',
    validatemessage,
    hideLabel,
    testId,
    additionalProps = {},
    displayMode,
    placeholder
  } = props;
  
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const stateProps = pConn.getStateProps() as StateProps;
  const propName: string = stateProps.value;

  let { readOnly = false, required = false, disabled = false } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === 'string' && prop === 'true')
  );

  let status: 'error' | 'success' | 'warning' | 'pending' | undefined;
  if (validatemessage) {
    status = 'error';
  }

  // Display mode (required for all Field components)
  if (displayMode === 'DISPLAY_ONLY') {
    return <StyledWrapper>{value}</StyledWrapper>;
  }

  // Edit mode
  return (
    <StyledWrapper>
      <Input
        {...additionalProps}
        label={label}
        labelHidden={hideLabel}
        info={validatemessage || helperText}
        status={status}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        testId={testId}
        onChange={(event: any) => {
          handleEvent(actions, 'change', propName, event.target.value);
        }}
        onBlur={(event: any) => {
          handleEvent(actions, 'blur', propName, value);
          pConn.getValidationApi().validate(value);
        }}
      />
    </StyledWrapper>
  );
}

export default withConfiguration(AcmeLibMyField);
```

### event-utils.ts (Field Components)

```typescript
const handleEvent = (actions: any, eventType: string, propName: string, value: any) => {
  switch (eventType) {
    case 'change':
      actions.updateFieldValue(propName, value);
      break;
    case 'blur':
      actions.triggerFieldChange(propName, value);
      break;
    case 'changeNblur':
      actions.updateFieldValue(propName, value);
      actions.triggerFieldChange(propName, value);
      break;
    default:
      break;
  }
};

export default handleEvent;
```

---

## Template Component Pattern

Templates arrange child components in layouts (forms, details views, pages). `children` holds one element per **region**; fields are one level down. This skeleton is the editable-layout starting point only. For read-only rendering, per-field layout, responsive columns and hidden children read [template-patterns.md](./template-patterns.md).

```typescript
import { Grid, Flex, FieldGroup, withConfiguration } from '@pega/cosmos-react-core';
import type { PConnFieldProps } from '../shared/PConnProps';
import '../shared/create-nonce';
import StyledWrapper from './styles';

interface Props extends PConnFieldProps {
  children: any[];
  NumCols?: string;
  showLabel?: boolean;
}

function AcmeLibMyTemplate(props: Props) {
  const { children = [], NumCols = '1', label, showLabel, getPConnect, readOnly, displayMode } = props;
  const propsToUse = { label, showLabel, ...getPConnect().getInheritedProps() };
  const nCols = parseInt(NumCols, 10);

  return (
    <StyledWrapper>
      <FieldGroup name={propsToUse.showLabel ? propsToUse.label : ''}>
        <Grid container={{ cols: `repeat(${nCols}, minmax(0, 1fr))`, gap: 2 }}>
          {children}
        </Grid>
      </FieldGroup>
    </StyledWrapper>
  );
}

export default withConfiguration(AcmeLibMyTemplate);
```

---

## Widget Component Pattern

Widgets are standalone UI blocks that fetch their own data.

```typescript
import { useState, useEffect } from 'react';
import { Table, Card, CardHeader, CardContent, Text, withConfiguration } from '@pega/cosmos-react-core';
import type { PConnFieldProps } from '../shared/PConnProps';
import '../shared/create-nonce';
import StyledWrapper from './styles';

interface Props extends PConnFieldProps {
  // Widget-specific props
}

function AcmeLibMyWidget(props: Props) {
  const { getPConnect, label } = props;
  const pConn = getPConnect();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const context = pConn.getContextName();

  useEffect(() => {
    const caseProp: string = PCore.getConstants().CASE_INFO.CASE_INFO_ID;
    const caseID = pConn.getValue(caseProp, '');
    const payload = { dataViewParameters: { CaseInstanceKey: caseID } };

    PCore.getDataApiUtils()
      .getData('D_DataPageName', payload, context)
      .then((response: any) => {
        setIsLoading(false);
        if (response.data.data !== null) {
          setData(response.data.data);
        }
      })
      .catch(() => {
        setData([]);
        setIsLoading(false);
      });
  }, [context]);

  return (
    <StyledWrapper>
      <Card>
        <CardHeader>
          <Text variant="h2">{label}</Text>
        </CardHeader>
        <CardContent>
          {/* Render data */}
        </CardContent>
      </Card>
    </StyledWrapper>
  );
}

export default withConfiguration(AcmeLibMyWidget);
```

---

## Presentation Component Pattern

Presentation components (`CASEVIEW`, `WSSCASEVIEW`) replace how a whole case view is rendered. They receive everything as props and cannot use PCore or PConnect.

```typescript
import { withConfiguration } from '@pega/cosmos-react-core';
import type { CaseViewProps } from '@pega/cosmos-react-work';
import '../shared/create-nonce';
import StyledWrapper from './styles';

function AcmeLibMyCaseView(props: CaseViewProps) {
  const { caseId, heading, caseType, tabs, tabContent } = props;
  const activeTab = tabContent?.find((tab) => tab.id === tabs.currentTabId);

  return (
    <StyledWrapper>
      <header>
        <span>{caseType}</span>
        <h1>{typeof heading === 'string' ? heading : heading?.text}</h1>
        <span>{caseId}</span>
      </header>
      {activeTab?.content}
    </StyledWrapper>
  );
}

export default withConfiguration(AcmeLibMyCaseView);
```

Always start from the scaffolded `index.tsx` (`npm run create -- Presentation CASEVIEW ...`) and read the prop types in `node_modules/@pega/cosmos-react-work/lib/components/CaseView/CaseView.types.d.ts` before using a prop. For `WSSCASEVIEW` the type comes from `@pega/cosmos-react-wss`.
