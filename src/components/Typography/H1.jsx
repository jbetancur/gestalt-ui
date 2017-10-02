import styled, { withTheme } from 'styled-components';

const H1Style = styled.h1`
  font-size: 22px;
  font-weight: 500;
  line-height: 28px;
  color: ${props => props.theme.colors['$md-grey-800']};
  ${props => props.inline && 'display: inline'};
`;

export default withTheme(H1Style);
