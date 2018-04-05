import styled from 'styled-components';
import { Button } from 'react-md';

const EnhancedButton = styled(Button)`
  text-align: center;
  box-shadow: none;

  &[type=button] {
    line-height: normal;
    font-weight: normal;
  }

  .md-icon-text {
    font-weight: normal;
  }

  .md-icon {
    color: inherit;
  }
`;

export default EnhancedButton;
