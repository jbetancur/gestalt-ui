import styled, { withTheme } from 'styled-components';

const Divider = styled.div`
  background-color: ${props => props.theme.colors.divider};
  border: 0;
  display: block;
  height: ${props => props.height || '1px'};
  margin-top: 5px;
  margin-bottom: 5px;
  width: 100%;
`;

export default withTheme(Divider);
