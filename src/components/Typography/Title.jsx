import styled from 'styled-components';

const TitleStyle = styled.div`
  font-size: 20px;
  min-height: 26px;
  color: ${props => (props.light ? props.theme.colors.fontCaption : props.theme.colors.fontTitle)};
  color: ${props => (props.inheritColor && 'inherit')};
  ${props => props.small && 'font-size: 16px;'};
  ${props => props.large && 'font-size: 22px;'};
  ${props => props.bold && 'font-weight: 500'};
`;

export default TitleStyle;
