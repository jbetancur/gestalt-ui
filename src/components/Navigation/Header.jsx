import styled from 'styled-components';
import { Toolbar } from 'react-md';

const Header = styled(Toolbar)`
  z-index: 19;
  background-color: ${props => props.theme.appHeaderColor};
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
`;

export default Header;
