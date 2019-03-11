import styled from 'styled-components';

const H3Style = styled.h3`
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  color: ${props => props.theme.colors.grey[900]};
  margin-block-start: 2px;
  margin-block-end: 2px;
`;

export default H3Style;
