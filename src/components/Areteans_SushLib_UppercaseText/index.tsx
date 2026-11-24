import { useState } from 'react';
import type { ChangeEvent, FocusEvent } from 'react';
import { Input, NoValue, withConfiguration } from '@pega/cosmos-react-core';

import type { PConnFieldProps } from '../shared/PConnProps';
import '../shared/create-nonce';

import handleEvent from './event-utils';
import StyledAreteansSushLibUppercaseTextWrapper from './styles';

interface AreteansSushLibUppercaseTextProps extends PConnFieldProps {
  maxLength?: number | string;
}

interface StateProps {
  value: string;
}

const isTrue = (flag: unknown) => flag === true || flag === 'true';

function AreteansSushLibUppercaseText(props: AreteansSushLibUppercaseTextProps) {
  const {
    getPConnect,
    value: valueProp,
    placeholder,
    displayMode,
    label,
    hideLabel = false,
    helperText,
    validatemessage,
    testId,
    maxLength,
    additionalProps,
  } = props;

  const readOnly = isTrue(props.readOnly);
  const required = isTrue(props.required);
  const disabled = isTrue(props.disabled);

  const value: string = valueProp ?? '';
  const parsedLimit = parseInt(String(maxLength ?? ''), 10);
  const limit = Number.isNaN(parsedLimit) || parsedLimit <= 0 ? undefined : parsedLimit;

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = (pConn.getStateProps() as StateProps).value;

  const normalize = (raw: string) => {
    const upper = raw.toUpperCase();
    return limit === undefined ? upper : upper.slice(0, limit);
  };

  const [draft, setDraft] = useState<string>(value);
  const [syncedValue, setSyncedValue] = useState<string>(value);

  if (value !== syncedValue) {
    setSyncedValue(value);
    setDraft(value);
  }

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraft(normalize(event.target.value));
    pConn.clearErrorMessages({ property: propName });
  };

  const handleOnBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const next = normalize(event.target.value);
    if (next === value) {
      pConn.getValidationApi().validate(next);
      return;
    }
    handleEvent(actions, 'changeNblur', propName, next);
  };

  if (displayMode === 'DISPLAY_ONLY') {
    return (
      <StyledAreteansSushLibUppercaseTextWrapper>{value ? value : <NoValue />}</StyledAreteansSushLibUppercaseTextWrapper>
    );
  }

  return (
    <StyledAreteansSushLibUppercaseTextWrapper>
      <Input
        {...additionalProps}
        type='text'
        value={draft}
        label={label}
        labelHidden={hideLabel}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        maxLength={limit}
        status={validatemessage ? 'error' : undefined}
        info={validatemessage || helperText}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        testId={testId ?? label}
      />
    </StyledAreteansSushLibUppercaseTextWrapper>
  );
}

export default withConfiguration(AreteansSushLibUppercaseText);
