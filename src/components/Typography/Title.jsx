import styled, { withTheme } from 'styled-components';

const TitleStyle = styled.div`
  font-size: 20px;
  color: ${props => (props.light ? props.theme.colors['$md-grey-700'] : props.theme.colors['$md-grey-900'])};
  ${props => props.small && 'font-size: 16px;'};
  ${props => props.large && 'font-size: 22px;'};
`;

export default withTheme(TitleStyle);
