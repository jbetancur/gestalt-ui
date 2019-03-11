import styled from 'styled-components';

const Divider = styled.hr`
  background-color: ${props => props.theme.colors.divider};
  margin: 0;
  flex-shrink: 0;
  border: none;
  display: block;
  height: ${props => props.width || '1px'};
  margin-top: 5px;
  margin-bottom: 5px;
  width: 100%;
`;

export default Divider;
