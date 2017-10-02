import styled, { withTheme } from 'styled-components';

const H4Style = styled.h4`
  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
  color: ${props => props.theme.colors['$md-grey-900']};
  ${props => props.inline && 'display: inline'};
`;

export default withTheme(H4Style);
