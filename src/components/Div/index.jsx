import styled, { withTheme } from 'styled-components';

const Div = styled.div`
  ${props => props.position && `position: ${props.position}`};
  ${props => props.disabled && 'pointer-events: none'};
  ${props => props.disabled && 'opacity: 0.4'};
  ${props => props.display && `display: ${props.display}`};
  ${props => props.padding && `padding: ${props.padding}`};
  ${props => props.paddingTop && `padding-top: ${props.paddingTop}`};
  ${props => props.paddingLeft && `padding-left: ${props.paddingLeft}`};
  ${props => props.paddingBottom && `padding-bottom: ${props.paddingBottom}`};
  ${props => props.paddingRight && `padding-right: ${props.paddingRight}`};
  ${props => props.height && `height: ${props.height}`};
  ${props => props.textAlign && `text-align: ${props.textAlign}`};
`;

export default withTheme(Div);
