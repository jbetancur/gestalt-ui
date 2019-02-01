import styled, { css, keyframes } from 'styled-components';
import { TextField } from 'components/ReduxFormFields';

const autofill = keyframes`
  to {
    background: transparent;
    color: inherit;
  }
`;

const animationRule = css`
  ${autofill};
`;

const TextFieldStyle = styled(TextField)`
  * {
    color: white;
  }

  input {
    background: rgba(0, 0, 0, 0) !important;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    padding: 2px;

    &::placeholder {
      color: white;
    }
  }

  .md-divider--text-field::after {
    background: ${props => props.theme.colors['$gf-bright-blue']};
  }

  .md-divider:not(.md-divider--text-field-error) {
    background: white;
  }

  .md-password-btn {
    height: 32px;
    width: 32px;
  }

  /* Hack for chrome & safari autofill ugliness */
  input:-webkit-autofill,
  input:-webkit-autofill:active,
  input:-webkit-autofill:focus,
  input.md-text-field:-webkit-autofill,
  input.md-text-field:-webkit-autofill:active,
  input.md-text-field:-webkit-autofill:focus {
    box-shadow: none;
    transition: background-color 10000s ease-in-out 0s;
    -webkit-animation-name: ${animationRule};
    -webkit-animation-fill-mode: both;
    -webkit-text-fill-color: white;
    caret-color: white;
  }
`;

export default TextFieldStyle;
