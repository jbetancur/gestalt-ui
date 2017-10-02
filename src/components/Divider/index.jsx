import styled, { withTheme } from 'styled-components';

const Divider = styled.hr`
  background-color: ${props => props.theme.colors['$md-grey-300']};
  border: 0;
  content: '';
  display: block;
  height: 1px;
  margin: 0;
  width: 100%;
`;

export default withTheme(Divider);
