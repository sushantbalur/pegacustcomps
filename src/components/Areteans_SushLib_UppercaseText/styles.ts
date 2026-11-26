import styled, { css } from 'styled-components';

// Issue #2: the uppercase text input must have a red background.
// Cosmos Input has no background prop, so the input element is styled here.
export default styled.div(() => {
  return css`
    margin: 0px 0;

    input {
      background-color: #d91c29;
      color: #ffffff;
    }

    input::placeholder {
      color: rgba(255, 255, 255, 0.8);
    }
  `;
});
