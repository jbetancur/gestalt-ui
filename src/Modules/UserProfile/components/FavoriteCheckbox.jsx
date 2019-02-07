import React, { memo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Checkbox, FontIcon } from 'react-md';

const Checked = styled(FontIcon)`
  color: ${props => props.theme.colors.favorite} !important;
`;

const FavoriteCheckbox = memo(({ id, checked, onChange }) => (
  <Checkbox
    id={id}
    name={id}
    label={null}
    checked={checked}
    onChange={onChange}
    checkedCheckboxIcon={<Checked>star</Checked>}
    uncheckedCheckboxIcon={<FontIcon>star_border</FontIcon>}
  />
));

FavoriteCheckbox.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

FavoriteCheckbox.defaultProps = {
  checked: false,
  onChange: () => { },
};


export default FavoriteCheckbox;
