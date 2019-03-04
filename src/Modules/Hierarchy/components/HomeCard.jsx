import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { Link } from 'react-router-dom';
import { Button } from 'components/Buttons';
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
      {createURL && <Button flat primary component={Link} to={createURL}>Create</Button>}
      {manageURL && <Button flat primary component={Link} to={manageURL}>Manage</Button>}
      {documentationURL && <Button flat href={documentationURL} target="_blank">Learn</Button>}
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
