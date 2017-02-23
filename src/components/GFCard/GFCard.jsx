import React from 'react';
import styled from 'styled-components';
import Card from 'react-md/lib/Cards/Card';

const EnhancedCard = styled(Card)`
  position: relative;
  min-width: 23.5em;
  max-Width: 28em;
  height: 13.5em;
  cursor: pointer;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.08), 0 1px 1px 0 rgba(0, 0, 0, 0.12), 0 1px 1px -2px rgba(0, 0, 0, 0.2);
`;

const GFCard = props => <EnhancedCard {...props} />;

export default GFCard;
