import styled, { withTheme } from 'styled-components';

const CaptionStyle = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors['$md-grey-800']};
  ${props => props.block && 'display: block'};
  ${props => props.small && 'font-size: 11px'};
  ${props => props.large && 'font-size: 13px'};
`;

export default withTheme(CaptionStyle);
