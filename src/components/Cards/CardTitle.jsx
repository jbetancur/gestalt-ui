import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { H1 } from 'components/Typography';

const Wrapper = styled.div`
  padding: 16px;
`;

const CardTitle = props => <Wrapper><H1>{props.children}</H1></Wrapper>;

CardTitle.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default withTheme(CardTitle);
