import React, { memo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';
import StarIcon from '@material-ui/icons/Star';
import StarIconOutline from '@material-ui/icons/StarBorderOutlined';

const CheckedIcon = styled(StarIcon)`
  color: ${props => props.theme.colors.favorite};
`;

const FavoriteCheckbox = memo(({ id, checked, onChange }) => (
  <Checkbox
    id={id}
    name={id}
    label={null}
    checked={checked}
    onChange={onChange}
    icon={<StarIconOutline fontSize="small" />}
    checkedIcon={<CheckedIcon fontSize="small" />}
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
