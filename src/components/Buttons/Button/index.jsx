import styled from 'styled-components';
import { Button } from 'react-md';

const EnhancedButton = styled(Button)`
  margin-left: 0.1em;
  margin-right: 0.1em;
  text-align: center;
  box-shadow: none;

  /* fixes font when using React-Router-Link */
  .md-icon-text {
    font-weight: normal;
  }

  .md-icon {
    color: inherit;
  }
`;

export default EnhancedButton;
