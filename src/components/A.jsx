import styled, { withTheme, css } from 'styled-components';

const AStyle = styled.a`
  font-size: 12px;
  text-decoration: none;
  ${props => props.bubble && css`
    background-color: ${props.theme.colors['$md-grey-200']};
    border-radius: 15px;
    padding-left: 4px;
    padding-right: 4px;
    font-weight: 400;
    color: ${props.theme.colors['$md-blue-900']};;
  `};
  ${props => props.block && 'display: block'};
`;

export default withTheme(AStyle);
