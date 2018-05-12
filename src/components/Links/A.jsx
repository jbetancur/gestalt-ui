import styled, { withTheme, css } from 'styled-components';

const AStyle = styled.a`
  font-size: 13px;
  text-decoration: none;
  ${props => props.bubble && css`
    background-color: ${props.theme.colors['$md-grey-200']};
    border-radius: 15px;
    padding-left: 4px;
    padding-right: 4px;
    font-weight: 400;
  `};
  ${props => props.block && 'display: block'};
  ${props => props.primary && `color: ${props.theme.colors['$md-blue-600']}`};
`;

export default withTheme(AStyle);
