import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { DotActivity } from 'components/ProgressIndicators';

const ListItemTextStyle = styled(ListItemText)`
  display: flex;
  align-items: center;
  height: 17px;
`;

const ActivityContainer = styled.div`
  width: 100%;
  height: 3em;
  text-align: center;

  .spinner {
    line-height: 52px;
  }
`;

const ActivityIndicator = () => (
  <ActivityContainer>
    <DotActivity size={1.2} primary centered />
  </ActivityContainer>
);

/* eslint-disable react/prop-types */
const FormHelperTextWrapper = ({
  input: { name, value, ...restIput },
  meta,
  label,
  margin,
  variant,
  formControlProps,
  menuItems,
  itemLabel,
  itemValue,
  id,
  disabled,
  async,
  ...rest
}) => {
  const showError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched;
  const [state, setState] = React.useState({
    labelWidth: 0,
  });
  const inputLabelRef = React.useRef(null);

  React.useEffect(() => {
    setState({
      ...state,
      // eslint-disable-next-line react/no-find-dom-node
      labelWidth: ReactDOM.findDOMNode(inputLabelRef.current).offsetWidth,
    });
  }, []);

  return (
    <FormControl
      {...formControlProps}
      error={showError}
      fullWidth
      variant={variant}
      disabled={disabled}
      margin={margin}
    >
      <InputLabel
        ref={inputLabelRef}
        htmlFor={id}
        margin={margin}
      >
        {label}
      </InputLabel>

      <Select
        {...restIput}
        {...rest}
        name={name}
        value={value}
        disabled={disabled}
        input={
          <OutlinedInput
            fullWidth
            labelWidth={state.labelWidth}
            name={name}
            id={id}
          />
        }
        SelectDisplayProps={{
          style: {
            display: 'flex',
            alignItems: 'center',
          }
        }}
      >
        {async && !menuItems.length > 0 && (
          <ActivityIndicator />
        )}

        {menuItems && menuItems.map((item, index) => {
          if (itemLabel && itemValue) {
            return (
              <MenuItem key={index} value={item[itemValue]}>
                {item.leftIcon && (
                  <ListItemIcon>
                    {item.leftIcon}
                  </ListItemIcon>
                )}
                <ListItemTextStyle
                  primary={item[itemLabel]}
                  secondary={item.secondaryLabel || ''}
                />
              </MenuItem>
            );
          }

          return (
            <MenuItem key={index} value={item}>
              {item.leftIcon && (
                <ListItemIcon>
                  {item.leftIcon}
                </ListItemIcon>
              )}
              <ListItemTextStyle primary={item} />
            </MenuItem>
          );
        })}
      </Select>

      {showError &&
        <FormHelperText>{meta.error || meta.submitError}</FormHelperText>
      }
    </FormControl>
  );
};

FormHelperTextWrapper.propTypes = {
  variant: PropTypes.string,
  margin: PropTypes.string,
};

FormHelperTextWrapper.defaultProps = {
  variant: 'outlined',
  margin: 'dense',
};


export default FormHelperTextWrapper;
