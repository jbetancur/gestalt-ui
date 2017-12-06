import styled, { withTheme } from 'styled-components';
import { Toolbar } from 'react-md';

const Header = styled(Toolbar)`
  z-index: 9999;
  background-color: ${props => props.theme.appHeaderColor};
`;

export default withTheme(Header);
