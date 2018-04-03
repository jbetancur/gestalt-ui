import styled, { withTheme } from 'styled-components';

const FullPage = styled.div`
  position: fixed;
  background-color: ${props => props.theme.colors['$md-grey-200']};
  bottom: 0;
  left: 0;
  height: 64px;
  width: 100%;
  padding: 16px 24px 16px 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-top: 1px solid ${props => props.theme.colors['$md-grey-200']};
`;

export default withTheme(FullPage);
