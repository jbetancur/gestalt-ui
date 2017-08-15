import styled, { withTheme } from 'styled-components';

const Div = styled.div`
  ${props => props.position && `position: ${props.position}`};
  ${props => props.disabled && 'pointer-events: none'};
  ${props => props.disabled && 'opacity: 0.4'};
  ${props => props.display && `display: ${props.display}`};
`;

export default withTheme(Div);
