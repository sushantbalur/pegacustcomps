import { Input, EmailDisplay, PhoneDisplay, URLDisplay, withConfiguration } from '@pega/cosmos-react-core';

import type { PConnFieldProps } from '../shared/PConnProps';
import '../shared/create-nonce';

import StyledAreteansSushLibMancreateWrapper from './styles';

// interface for props
interface AreteansSushLibMancreateProps extends PConnFieldProps {
  // If any, enter additional props that only exist on TextInput here
  isTableFormatter?: boolean;
  formatter: string;
  variant?: any;
}

// interface for StateProps object
interface StateProps {
  value: string;
  hasSuggestions: boolean;
}

export const formatExists = (formatterVal: string) => {
  const formatterValues = ['TextInput', 'WorkStatus', 'RichText', 'Email', 'Phone', 'URL', 'Operator'];
  let isformatter = false;
  if (formatterValues.includes(formatterVal)) {
    isformatter = true;
  }
  return isformatter;
};

export const textFormatter = (formatter: string, value: string) => {
  let displayComponent: any = null;
  switch (formatter) {
    case 'TextInput': {
      displayComponent = value;
      break;
    }
    case 'Email': {
      displayComponent = <EmailDisplay value={value} displayText={value} variant="link" />;
      break;
    }
    case 'Phone': {
      displayComponent = <PhoneDisplay value={value} variant="link" />;
      break;
    }
    case 'URL': {
      displayComponent = <URLDisplay target="_blank" value={value} displayText={value} variant="link" />;
      break;
    }
    // no default
  }
  return displayComponent;
};

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
function AreteansSushLibMancreate(props: AreteansSushLibMancreateProps) {
  const {
    getPConnect,
    value,
    placeholder,
    disabled = false,
    displayMode,
    readOnly = false,
    required = false,
    label,
    hideLabel = false,
    testId,
    isTableFormatter = false,
  } = props;

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const stateProps = pConn.getStateProps() as StateProps;
  const propName: string = stateProps.value;
  const { formatter } = props;

  const handleOnChange = (event: any) => {
    const { value: updatedValue } = event.target;
    actions.updateFieldValue(propName, updatedValue);
  };

  if (displayMode === 'DISPLAY_ONLY') {
    let displayComp = value || <span aria-hidden="true">&ndash;&ndash;</span>;
    if (isTableFormatter && formatExists(formatter)) {
      displayComp = textFormatter(formatter, value);
    }
    return <StyledAreteansSushLibMancreateWrapper> {displayComp} </StyledAreteansSushLibMancreateWrapper>;
  }

  return (
    <StyledAreteansSushLibMancreateWrapper>
      <Input
        type="text"
        value={value}
        label={label}
        labelHidden={hideLabel}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        onChange={handleOnChange}
        testId={testId}
      />
    </StyledAreteansSushLibMancreateWrapper>
  );
}

export default withConfiguration(AreteansSushLibMancreate);
