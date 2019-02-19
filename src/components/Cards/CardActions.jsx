import styled from 'styled-components';

const CardActions = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px;
  ${props => props.center && 'justify-content: center'};
`;

export default CardActions;
