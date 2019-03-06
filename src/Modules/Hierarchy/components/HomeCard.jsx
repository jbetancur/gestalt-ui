import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { Link } from 'react-router-dom';
import { FlatButton } from 'components/Buttons';
import { Card, CardTitle, CardContent, CardText, CardActions } from 'components/Cards';

const HomeCardBase = styled(Card)`
  border-radius: 4px;
  height: 245px;
`;

const CardStyle = styled(HomeCardBase)`
  svg,
  i {
    color: ${props => props.theme.colors[`$md-${props.color}-${props.gradient}`]};
  }
`;

const HomeCard = ({ title, icon, iconColor, iconGradient, createURL, manageURL, documentationURL, children }) => (
  <CardStyle color={iconColor} gradient={iconGradient}>
    <CardTitle
      title={title}
      icon={icon}
    />
    <CardContent minHeight="120px">
      <CardText>
        {children}
      </CardText>
    </CardContent>

    <CardActions center>
      {createURL && <FlatButton color="primary" component={Link} to={createURL} label="Create" />}
      {manageURL && <FlatButton color="primary" component={Link} to={manageURL} label="Manage" />}
      {documentationURL && <FlatButton color="primary" ahref={documentationURL} target="_blank" label="Manage" />}
    </CardActions>
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
