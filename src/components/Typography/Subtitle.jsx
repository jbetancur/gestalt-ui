import styled, { withTheme } from 'styled-components';

const SubtitleStyle = styled.div`
  font-size: 13px;
  color: ${props => props.theme.colors['$md-grey-700']};
`;

export default withTheme(SubtitleStyle);
