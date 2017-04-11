/* TooltpFontIcon.jsx */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FontIcon from 'react-md/lib/FontIcons';
import injectTooltip from 'react-md/lib/Tooltips';

// Material icons shouldn't have any other children other than the child string and
// it gets converted into a span if the tooltip is added, so we add a container
// around the two.

const TooltipWrapper = styled.div`
  position: absolute;
`;

const TooltipFontIcon = injectTooltip(({ children, iconClassName, className, tooltip, ...props }) => (
  <TooltipWrapper {...props}>
    {tooltip}
    <FontIcon iconClassName={iconClassName}>{children}</FontIcon>
  </TooltipWrapper>
));

TooltipFontIcon.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
  iconClassName: PropTypes.string,
  tooltip: PropTypes.node,
};

export default TooltipFontIcon;
