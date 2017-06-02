import styled from 'styled-components';
import CardTitle from 'react-md/lib/Cards/CardTitle';

const EnhancedCardTitle = styled(CardTitle)`
  &.md-card-title {
      padding-top: 0px;
      padding-left: 23px;
      padding-right: 23px;
  }
`;

export default EnhancedCardTitle;
