import styled from 'styled-components';

const AStyle = styled.a`
  font-size: 13px;
  text-decoration: none;
  ${props => props.block && 'display: block'};
  ${props => props.primary && `color: ${props.theme.colors.primary.default}`};
`;

export default AStyle;
