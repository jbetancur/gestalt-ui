import styled, { withTheme } from 'styled-components';

const Header = styled.header`
  ${props => !props.expandable && 'padding-left: 14px'};
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 4em;
  background-color: ${props => props.theme.colors['$md-grey-50']};
  border-top: 1px solid ${props => props.theme.colors['$md-grey-200']};
  border-bottom: 1px solid ${props => props.theme.colors['$md-grey-200']};
  font-weight: 700;
  user-select: none;

  &:hover {
    cursor: pointer;
  }
`;

export default withTheme(Header);
