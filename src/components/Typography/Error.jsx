import styled, { withTheme } from 'styled-components';

const Error = styled.span`
  font-size: 12px !important;
  color: ${props => props.theme.colors['$md-red-500']};
  ${props => props.block && 'display: block'};
`;

export default withTheme(Error);
