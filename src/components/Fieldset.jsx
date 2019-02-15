import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const FieldsetStyle = styled.fieldset`
  ${props => (props.border
    ? `border: 2px solid ${props.theme.colors.divider} !important`
    : 'border: none !important')};
  ${props => props.background && `background-color: ${props.theme.colors.background}`};
`;

const LegendStyle = styled.legend`
  height: 1.3em;
  color: ${props => props.theme.colors.font} !important;

  code {
    color: ${props => props.theme.colors.background} !important;
  }

  font-size: ${props => props.legendFontSize};
`;

const ContentStyle = styled(({ height, overflow, minHeight, maxHeight, ...rest }) => <div {...rest} />)`
  width: 100%;
  ${props => props.maxHeight && 'overflow: scroll'};
  ${props => props.maxHeight && `max-height: ${props.maxHeight}`};
  ${props => props.height && `height: ${props.height}`};
  ${props => props.overflow && `overflow: ${props.overflow}`};
  ${props => (props.minHeight && `min-height: ${props.minHeight}`)};
`;

const Fieldset = props => (
  <FieldsetStyle className={props.className} style={props.style} border={props.border} background={props.background}>
    {props.legend &&
      <LegendStyle legendFontSize={props.legendFontSize}>
        {props.legend}
      </LegendStyle>}
    <ContentStyle
      minHeight={props.minHeight}
      maxHeight={props.maxHeight}
      height={props.height}
      overflow={props.overflow}
    >
      {props.children}
    </ContentStyle>
  </FieldsetStyle>
);

Fieldset.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  legend: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.node]),
  legendFontSize: PropTypes.string,
  maxHeight: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  minHeight: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  overflow: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  style: PropTypes.object,
  className: PropTypes.string,
  border: PropTypes.bool,
  background: PropTypes.bool,
};

Fieldset.defaultProps = {
  children: null,
  legend: false,
  legendFontSize: '1em',
  maxHeight: false,
  minHeight: false,
  height: false,
  overflow: false,
  style: {},
  className: '',
  border: true,
  background: false,
};

export default Fieldset;
