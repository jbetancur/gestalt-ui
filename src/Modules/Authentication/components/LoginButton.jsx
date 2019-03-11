import Button from '@material-ui/core/Button';
import styled from 'styled-components';

const LoginButton = styled(Button)`
  background: white !important;
  color: ${props => props.theme.colors.loginFont} !important;
  width: 100%;
  height: 38px;
  font-weight: 700 !important;

  &:hover {
    background: ${props => props.theme.colors.loginButtonVariant} !important;
  }
`;

export default LoginButton;
