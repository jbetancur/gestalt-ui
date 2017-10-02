import styled, { withTheme } from 'styled-components';

const H2Style = styled.h2`
  font-size: 18px;
  font-weight: 400;
  line-height: 18px;
  color: ${props => props.theme.colors['$md-grey-900']};
  ${props => props.inline && 'display: inline'};
`;

export default withTheme(H2Style);
