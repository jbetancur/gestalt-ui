import { Button } from 'components/Buttons';
import styled, { withTheme } from 'styled-components';

const LoginButton = styled(Button)`
  background: white;
  color: ${props => props.theme.colors['$russian-black-50']};
  width: 100%;
  box-shadow: none;
  font-weight: 700;

  &:hover {
    background: ${props => props.theme.colors['$md-blue-grey-50']};
  }

  &:disabled {
    background: ${props => props.theme.colors['$md-blue-grey-50']};
  }
`;

export default withTheme(LoginButton);
