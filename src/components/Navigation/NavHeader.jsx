import styled, { withTheme } from 'styled-components';

const NavHeader = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.colors['$md-grey-50']};
  border-bottom: 1px solid ${props => props.theme.colors['$md-grey-300']};
  padding: 12px;
  text-align: left;
  min-height: 56px;
  overflow: visible;
  width: 100%;
  z-index: 4;
`;

export default withTheme(NavHeader);
