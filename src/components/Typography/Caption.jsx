import styled, { withTheme } from 'styled-components';

const CaptionStyle = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors['$md-grey-900']};
  ${props => props.block && 'display: block'};
`;

export default withTheme(CaptionStyle);
