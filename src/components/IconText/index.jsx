import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FontIcon from 'react-md/lib/FontIcons';

const Div = styled.div`
    position: relative;
`;

const Children = styled.span`
    position: absolute;
    margin-top: -.2em;
    padding: .1em;
`;

const EnhancedIcon = styled(FontIcon)`
  font-size: 16px;
`;

const IconText = props =>
  <Div><EnhancedIcon>{props.icon}</EnhancedIcon><Children>{props.children}</Children></Div>;

IconText.propTypes = {
  icon: PropTypes.string.isRequired,
  children: PropTypes.object.isRequired
};

export default IconText;
