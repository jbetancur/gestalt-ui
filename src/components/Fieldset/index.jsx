import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';

const FieldsetStyle = styled.fieldset`
  border: .2em solid ${props => props.theme.colors['$md-grey-100']} !important;
  width: 100% !important;
`;

const LegendStyle = styled.legend`
  height: 1.3em;
  color: ${props => props.theme.colors['$md-grey-700']} !important;

  code {
    color: ${props => props.theme.colors['$md-grey-100']} !important;
  }

  font-size: ${props => props.legendFontSize};
`;

const ContentStyle = styled.div`
  width: 100%;
  ${props => props.maxHeight && 'overflow: scroll'};
  ${props => props.maxHeight && `max-height: ${props.maxHeight}`};
  ${props => props.height && `height: ${props.height}`};
  ${props => props.overflow && `overflow: ${props.overflow}`};
`;

const Fieldset = props => (
  <FieldsetStyle className={props.className} style={props.style}>
    {props.legend &&
      <LegendStyle legendFontSize={props.legendFontSize}>
        {props.legend}
      </LegendStyle>}
    <ContentStyle
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
  legend: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  legendFontSize: PropTypes.string,
  maxHeight: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  overflow: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  style: PropTypes.object,
  className: PropTypes.string,
};

Fieldset.defaultProps = {
  children: null,
  legend: false,
  legendFontSize: '1em',
  maxHeight: false,
  height: false,
  overflow: false,
  style: {},
  className: '',
};

export default withTheme(Fieldset);
