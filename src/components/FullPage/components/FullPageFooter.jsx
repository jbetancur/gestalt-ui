import styled, { withTheme } from 'styled-components';

const FullPageFooter = styled.footer`
  position: fixed;
  background-color: ${props => props.theme.colors['$md-white']};
  bottom: 0;
  right: 0;
  min-height: 64px;
  width: calc(100% - 72px);
  padding: 8px 24px 8px 24px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
  border-top: 1px solid ${props => props.theme.colors['$md-grey-200']};
  z-index: 19;

  button,
  a {
    margin-left: 0.1em;
    margin-right: 0.1em;
  }
`;

export default withTheme(FullPageFooter);
