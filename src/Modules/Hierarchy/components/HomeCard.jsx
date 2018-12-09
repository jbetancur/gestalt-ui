import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { Link } from 'react-router-dom';
import { Button, CardTitle, CardText, CardActions } from 'react-md';
import { Card } from 'components/Cards';
import { P } from 'components/Typography';

const HomeCardBase = styled(Card)`
  border-radius: 4px;
`;

const CardTitleStyle = styled(CardTitle)`
  h2 {
    font-size: 16px;
  }
`;

const CardTextStyle = styled(CardText)`
  min-height: 125px;
`;

const CardActionsStyle = styled(CardActions)`
  justify-content: center;
`;

const CardStyle = styled(HomeCardBase)`
  svg,
  i {
    color: ${props => props.theme.colors[`$md-${props.color}-${props.gradient}`]};
  }
`;

const HomeCard = props => (
  <CardStyle color={props.iconColor} gradient={props.iconGradient}>
    <CardTitleStyle
      title={props.title}
      avatar={props.icon}
    />
    <CardTextStyle>
      <P>
        {props.children}
      </P>
    </CardTextStyle>

    <CardActionsStyle>
      {props.createURL && <Button flat primary component={Link} to={props.createURL}>Create</Button>}
      {props.manageURL && <Button flat primary component={Link} to={props.manageURL}>Manage</Button>}
      {props.documentationURL && <Button flat href={props.documentationURL} target="_blank">Learn</Button>}
    </CardActionsStyle>
  </CardStyle>
);

HomeCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.func),
    PropTypes.object
  ]).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  iconColor: PropTypes.string,
  iconGradient: PropTypes.string,
  documentationURL: PropTypes.string,
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
