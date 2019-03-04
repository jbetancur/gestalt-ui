import styled from 'styled-components';

const H2Style = styled.h2`
  font-size: 18px;
  font-weight: 400;
  line-height: 18px;
  color: ${props => props.theme.colors['$md-grey-900']};
  margin-block-start: 2px;
  margin-block-end: 2px;
`;

export default H2Style;
