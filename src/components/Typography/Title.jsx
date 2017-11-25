import styled, { withTheme } from 'styled-components';

const TitleStyle = styled.div`
  font-size: 18px;
  color: ${props => props.theme.colors['$md-grey-900']};
  ${props => props.small && 'font-size: 16px;'};
  ${props => props.large && 'font-size: 20px;'};
`;

export default withTheme(TitleStyle);
