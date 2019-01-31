import styled from 'styled-components';

const Content = styled.div`
  ${props => props.disabled && 'pointer-events: none'};
  ${props => props.disabled && 'opacity: 0.4'};
  width: 100%;
  display: ${props => (props.isExpanded ? 'block' : 'none')};
  ${props => (props.noPadding ? 'padding: 0' : 'padding: 1em')};
  ${props => (props.minHeight && `min-height: ${props.minHeight}`)};
  ${props => (props.maxHeight && `max-height: ${props.maxHeight}`)};
`;

export default Content;
