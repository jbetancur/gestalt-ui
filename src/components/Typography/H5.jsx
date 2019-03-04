import styled from 'styled-components';

const H4Style = styled.h5`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: ${props => props.theme.colors['$md-grey-900']};
  margin-block-start: 2px;
  margin-block-end: 2px;
`;

export default H4Style;
