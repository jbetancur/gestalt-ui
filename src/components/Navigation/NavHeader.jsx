import styled, { withTheme } from 'styled-components';

const NavHeader = styled.div`
  background-color: ${props => props.theme.colors['$md-white']};
  border-bottom: 1px solid ${props => props.theme.colors['$md-grey-200']};
  padding: 13px 8px 13px 8px;
  text-align: left;
  min-height: 64px;
  overflow: visible;
  /* position: fixed;
  width: calc(100% - 70px); */
  width: 100%;
  z-index: 4;
  top: 64px;

  .md-btn--icon {
    height: 32px;
    padding: 0;
    width: 32px;
  }
`;

export default withTheme(NavHeader);
