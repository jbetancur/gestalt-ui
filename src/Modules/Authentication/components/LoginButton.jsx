import { Button } from 'components/Buttons';
import styled from 'styled-components';

const LoginButton = styled(Button)`
  background: white !important;
  color: ${props => props.theme.colors.loginFont};
  width: 100%;
  height: 38px;
  font-weight: 700 !important;

  &:hover {
    background: ${props => props.theme.colors.loginButtonVariant} !important;
  }
`;

export default LoginButton;
