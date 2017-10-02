import styled, { withTheme } from 'styled-components';

const H3Style = styled.h3`
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  color: ${props => props.theme.colors['$md-grey-900']};
  ${props => props.inline && 'display: inline'};
`;

export default withTheme(H3Style);
