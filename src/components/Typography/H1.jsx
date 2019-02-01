import styled from 'styled-components';

const H1Style = styled.h1`
  font-size: 22px;
  font-weight: 500;
  line-height: 28px;
  color: ${props => props.theme.colors['$md-grey-800']};
`;

export default H1Style;
