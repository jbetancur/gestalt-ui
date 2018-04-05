import styled, { withTheme } from 'styled-components';

const NavHeader = styled.div`
  background-color: ${props => props.theme.colors['$md-white']};
  border-bottom: 1px solid ${props => props.theme.colors['$md-grey-200']};
  padding: 13px 16px 16px 8px;
  text-align: left;
  min-height: 64px;
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
