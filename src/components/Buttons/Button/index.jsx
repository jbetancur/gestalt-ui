import styled, { css, withTheme } from 'styled-components';
import { Button } from 'react-md';

const EnhancedButton = styled(Button)`
  text-align: center;

  ${props => props.raised && css`
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 1px 0px, rgba(0, 0, 0, 0.1) 0px 1px 1px 0px, rgba(0, 0, 0, 0.2) 0px 0px 1px -4px;
    &:disabled {
      box-shadow: none;s
    }
  `};

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

export default withTheme(EnhancedButton);
