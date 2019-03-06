import React, { PureComponent } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

// Cannot use the ref attribute on function components because they don’t have instances:
// This bearks when using inteterminate - which internally to material-ui is likely a ref
class CheckboxWrapper extends PureComponent {
  render() {
    return (
      <Checkbox
        {...this.props}
        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
        indeterminateIcon={<IndeterminateCheckBoxIcon fontSize="small" />}
        checkedIcon={<CheckBoxIcon fontSize="small" />}
        style={{ padding: '10px' }}
      />
    );
  }
}
export default CheckboxWrapper;
