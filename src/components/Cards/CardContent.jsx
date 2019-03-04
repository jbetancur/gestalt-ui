import styled from 'styled-components';

const CardContent = styled.div`
  position: relative;
  ${props => (props.noPadding ? 'padding: 0' : 'padding: 16px')};
  ${props => (props.minHeight && `min-height: ${props.minHeight}`)};
  ${props => (props.maxHeight && `max-height: ${props.maxHeight}`)};
`;

export default CardContent;
