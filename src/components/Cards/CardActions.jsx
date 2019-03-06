import styled from 'styled-components';

const CardActions = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px;
  ${props => props.center && 'justify-content: center'};
`;

export default CardActions;
