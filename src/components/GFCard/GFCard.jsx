import React from 'react';
import styled from 'styled-components';
import Card from 'react-md/lib/Cards/Card';

const EnhancedCard = styled(Card)`
  position: relative;
  min-width: 23.5em;
  max-Width: 28em;
  height: 13.5em;
  cursor: pointer;
  // box-shadow: ${props => props.theme.boxShadow};
`;

const GFCard = props => <EnhancedCard {...props} />;

export default GFCard;
