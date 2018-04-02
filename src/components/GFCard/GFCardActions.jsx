import styled from 'styled-components';
import { CardActions } from 'react-md';

const GFCardActions = styled(CardActions)`
  position: absolute;
  bottom: 0;
  justify-content: flex-end !important;
  width: 100%;

  i,
  svg {
    font-size: 18px !important;
  }
`;

export default GFCardActions;
