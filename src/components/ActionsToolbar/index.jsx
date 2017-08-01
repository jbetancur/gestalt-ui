import styled, { withTheme } from 'styled-components';

const ActionsBar = styled.div`
  border-top: 1px solid ${props => props.theme.colors['$md-grey-300']};
  border-bottom: 1px solid ${props => props.theme.colors['$md-grey-300']};
  padding-left: .3em;
  padding-right: .3em;
  text-align: left;
  min-height: 3em;
`;

export default withTheme(ActionsBar);
