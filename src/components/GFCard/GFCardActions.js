import styled from 'styled-components';
import CardActions from 'react-md/lib/Cards/CardActions';

const GFCardActions = styled(CardActions)`
  position: absolute;
  bottom: 0;
  justify-content: flex-end !important;
  width: 100%;
  .md-icon {
    font-size: 1.2em;
  }
`;

export default GFCardActions;
