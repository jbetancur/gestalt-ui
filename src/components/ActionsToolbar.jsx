import styled, { withTheme } from 'styled-components';

const ActionsBar = styled.div`
  display: flex;
  align-items: center;
  text-align: left;
  min-height: 3em;
  padding: .3em;
`;

export default withTheme(ActionsBar);
