import React, { PropTypes } from 'react';
import Isvg from 'react-inlinesvg';
import styled from 'styled-components';
import cn from 'classnames';
import iconSVG from 'assets/icons/platform.svg';

const EnhancedIcon = styled(Isvg)`
  &.padded {
    padding: .7em;
  }
`;

const GestaltPlatformIcon = props => <EnhancedIcon src={iconSVG} className={cn({ padded: props.inTabs })} />;

GestaltPlatformIcon.propTypes = {
  inTabs: PropTypes.bool,
};

GestaltPlatformIcon.defaultProps = {
  inTabs: false,
};

export default GestaltPlatformIcon;
