import styled from 'styled-components';

const H5Style = styled.h5`
  font-size: 13px;
  font-weight: 400;
  line-height: 14px;
  color: ${props => props.theme.colors['$md-grey-900']};
  margin-block-start: 2px;
  margin-block-end: 2px;
`;

export default H5Style;
