import styled, { withTheme } from 'styled-components';

const NavHeader = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.colors['$md-white']};
  border-bottom: 1px solid ${props => props.theme.colors['$md-grey-200']};
  padding: 10px;
  text-align: left;
  min-height: 56px;
  overflow: visible;
  width: 100%;
  z-index: 4;

  .md-btn--icon {
    height: 32px;
    padding: 0;
    width: 32px;
  }
`;

export default withTheme(NavHeader);
