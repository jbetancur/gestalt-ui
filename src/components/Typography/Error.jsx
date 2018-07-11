import styled, { withTheme } from 'styled-components';

const Error = styled.span`
  font-size: 12px !important;
  color: ${props => props.theme.colors['$md-red-500']};
  ${props => props.block && 'display: block'};
  ${props => props.bold && 'font-weight: 700'};
`;

export default withTheme(Error);
