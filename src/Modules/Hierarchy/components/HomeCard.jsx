import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { Link } from 'react-router-dom';
import { Button, Card, CardTitle, CardText, CardActions } from 'react-md';
import { P } from 'components/Typography';

const HomeCardBase = styled(Card) `
  background-image: radial-gradient(circle,  ${props => props.theme.colors['$md-grey-50']} 0, white 100%);
  border-radius: 2px;
`;

const CartTitleStyle = styled(CardTitle)`
  h2 {
    font-size: 18px;
  }
`;

const CardActionsStyle = styled(CardActions)`
  justify-content: center;
`;

const CardStyle = HomeCardBase.extend`
  svg, i {
    color: ${props => props.theme.colors[`$md-${props.color}-${props.gradient}`]};
  }
`;

const HomeCard = props => (
  <CardStyle color={props.iconColor} gradient={props.iconGradient}>
    <CartTitleStyle
      title={props.title}
      avatar={props.icon}
    />
    <CardText>
      <P>
        {props.children}
      </P>
    </CardText>

    <CardActionsStyle>
      {props.createURL && <Button flat primary component={Link} to={props.createURL}>Create</Button>}
      {props.manageURL && <Button flat primary component={Link} to={props.manageURL}>Manage</Button>}
      {props.documentationURL && <Button flat href={props.documentationURL} target="_blank">Learn</Button>}
    </CardActionsStyle>
  </CardStyle>
);

HomeCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  iconColor: PropTypes.string,
  iconGradient: PropTypes.string,
  documentationURL: PropTypes.string.isRequired,
  createURL: PropTypes.string,
  manageURL: PropTypes.string,
};

HomeCard.defaultProps = {
  children: null,
  createURL: '',
  manageURL: '',
  documentationURL: '',
  iconColor: 'blue',
  iconGradient: '500'
};

export default withTheme(HomeCard);
