import styled, { withTheme } from 'styled-components';

const TitleStyle = styled.div`
  display: inline-block;
  font-size: 18px;
  color: ${props => props.theme.colors['$md-grey-800']};
  ${props => props.small && 'font-size: 16px;'};
  ${props => props.large && 'font-size: 20px;'};
`;

export default withTheme(TitleStyle);
