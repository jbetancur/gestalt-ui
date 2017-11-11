import styled, { withTheme } from 'styled-components';

const ActionsBar = styled.div`
  // border-top: 1px solid ${props => props.theme.colors['$md-grey-300']};
  // border-bottom: 1px solid ${props => props.theme.colors['$md-grey-300']};
  text-align: left;
  min-height: 3em;
  padding: .3em;
`;

export default withTheme(ActionsBar);
