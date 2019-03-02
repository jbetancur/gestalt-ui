import { css, keyframes } from 'styled-components';

const autofill = keyframes`
  to {
    background: transparent;
    color: inherit;
  }
`;

const animationRule = css`
  ${autofill};
`;

export default css`
  * {
    color: white !important;
  }

  div {
    &::before {
      border-bottom: 2px solid ${props => props.theme.colors['$russian-black-25']} !important;
    }

    &::after {
      border-bottom: 2px solid ${props => props.theme.colors['$gf-bright-blue']} !important;
    }
  }

  input {
    background: rgba(0, 0, 0, 0) !important;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    color: white !important;

    &::placeholder {
      color: white !important;
    }
  }

  button {
    padding: 6px;
  }

  /* Hack for chrome & safari autofill ugliness */
  input:-webkit-autofill,
  input:-webkit-autofill:active,
  input:-webkit-autofill:focus {
    box-shadow: none;
    transition: background-color 10000s ease-in-out 0s;
    -webkit-animation-name: ${animationRule};
    -webkit-animation-fill-mode: both;
    -webkit-text-fill-color: white;
    caret-color: white;
  }
`;
