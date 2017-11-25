import styled from 'styled-components';
import CardTitle from 'react-md/lib/Cards/CardTitle';

// TODO: Write our own Card component
const EnhancedCardTitle = styled(CardTitle)`
  &.md-card-title {
      padding-top: 8px;
      padding-left: 16px;
      padding-right: 16px;
  }

  .md-card-title--title {
    max-width: 24em;
    word-break: break-word;

    &.md-card-title--large {
      font-size: 16.5px;
    }
  }
`;

export default EnhancedCardTitle;
