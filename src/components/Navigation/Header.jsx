import styled from 'styled-components';
import { Toolbar } from 'react-md';

const Header = styled(Toolbar)`
  z-index: 19;
  background-color: ${props => props.theme.appHeaderColor};
`;

export default Header;
