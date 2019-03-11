import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import FormControlLabel from '@material-ui/core/FormControlLabel';

const RadioWrapper = styled.div`
  ${props => (props.noPadding ? 'padding: 0' : 'padding: 8px 24px 8px 24px')};
`;

const RadioGroupStyle = styled(RadioGroup)`
  flex-direction: ${props => (props.row ? 'row' : 'column')};
`;

const RadioGroupControl = ({ label, controls, name, onChange, inline, noPadding, disabled, ...rest }) => (
  <RadioWrapper noPadding={noPadding}>
    {label && <span>{label}</span>}
    <RadioGroupStyle
      {...rest}
      row={inline}
      name={name}
      aria-label={name}
      onChange={e => onChange(e.target.value)}
    >
      {controls && controls.map(control => (
        <FormControlLabel
          key={control.value}
          value={control.value}
          control={<Radio inline={inline} />}
          label={control.label}
          disabled={disabled || control.disabled}
        />
      ))}
    </RadioGroupStyle>
  </RadioWrapper>
);

RadioGroupControl.propTypes = {
  label: PropTypes.string,
  controls: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  inline: PropTypes.bool,
  noPadding: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

RadioGroupControl.defaultProps = {
  label: null,
  inline: false,
  noPadding: false,
  disabled: false,
};

export default RadioGroupControl;
