import styled, { withTheme } from 'styled-components';

const CaptionStyle = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors['$md-grey-900']};
`;

export default withTheme(CaptionStyle);
