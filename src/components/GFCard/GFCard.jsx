import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Card from 'react-md/lib/Cards/Card';

// black list non compliance typeColor, typeSymbol from DOM
const EnhancedCard = styled(Card)`
  position: relative;
  height: 10.5em;
  cursor: pointer;
  border-radius: 2px;
`;

const Type = styled.div`
  position: absolute;
  /* fixes chrome issue where on zoom in where there is a gap in the logo */
  top: 0;
  left: 0;
  font-size: 1em;
  width: 0;
  height: 0;
  border-top: 25px solid ${props => props.typeColor};
  border-right: 25px solid transparent;

  span {
    text-align: center;
    height: 12px;
    width: 12px;
    font-family: 'lovelo';
    font-size: 0.6em;
    position: absolute;
    top: -21px;
    left: 1.5px;
    color: white;
  }
`;

const GFCard = ({ typeColor, typeSymbol, children, ...rest }) => (
  <EnhancedCard {...rest}>
    <Type typeSymbol={typeSymbol} typeColor={typeColor}><span>{typeSymbol}</span></Type>
    {children}
  </EnhancedCard>
);

GFCard.propTypes = {
  children: PropTypes.array,
  typeSymbol: PropTypes.string,
  typeColor: PropTypes.string,
};

GFCard.defaultProps = {
  children: [],
  typeSymbol: '',
  typeColor: '#b0bec5',
};

export default GFCard;
