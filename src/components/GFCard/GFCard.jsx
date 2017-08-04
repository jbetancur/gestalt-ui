import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Card from 'react-md/lib/Cards/Card';

const EnhancedCard = styled(Card)`
  position: relative;
  min-width: 19.5em !important;
  max-width: 30em;
  height: 9.5em;
  cursor: pointer;
  border-radius: 4px;
  border-top: 4px solid ${props => props.typeColor};
`;

const Type = styled.div`
    position: absolute;
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
      font-size: .6em;
      position: absolute;
      top: -23px;
      left: 2px;
      color: white;
    }
`;

const GFCard = props => (
  <EnhancedCard typeSymbol={props.typeSymbol} {...props}>
    <Type typeSymbol={props.typeSymbol} typeColor={props.typeColor}><span>{props.typeSymbol}</span></Type>
    {props.children}
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
