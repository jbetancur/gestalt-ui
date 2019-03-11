import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DownloadIcon from '@material-ui/icons/CloudUpload';
import FlatButton from './FlatButton';

class FileButton extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    multiple: PropTypes.bool,
    accept: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    accept: '.yaml, .yml',
    multiple: false,
  };

  handleChange = (e) => {
    const { multiple, onChange } = this.props;

    const { files } = e.target;
    if (onChange) {
      if (!multiple) {
        onChange(files[0] || null, e);
      } else {
        onChange(Array.prototype.slice.call(files), e);
      }
    }
  };

  render() {
    const { label, accept, multiple, ...rest } = this.props;

    return (
      <FlatButton
        id="file-upload-button"
        component="label"
        color="primary"
        variant="contained"
        icon={<DownloadIcon fontSize="small" />}
        iconAfter
        label={label}
      >
        <input
          {...rest}
          id="file-upload-button"
          accept={accept}
          type="file"
          onChange={this.handleChange}
          multiple={multiple}
          aria-hidden="true"
          style={{ display: 'none' }}
        />
      </FlatButton>
    );
  }
}

export default FileButton;
