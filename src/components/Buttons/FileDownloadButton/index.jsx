import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';

function download(data, filename, mime) {
  const blob = new Blob([data], { type: mime });

  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // IE workaround for "HTML7007: One or more blob URLs were
    // revoked by closing the blob for which they were created.
    // These URLs will no longer resolve as the data backing
    // the URL has been freed."
    window.navigator.msSaveBlob(blob, filename);
  } else {
    const blobURL = window.URL.createObjectURL(blob);
    const tempLink = document.createElement('a');
    tempLink.href = blobURL;
    tempLink.setAttribute('download', filename);
    // tempLink.setAttribute('target', '_blank');
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
  }
}

class FileDownloadButton extends PureComponent {
  static propTypes = {
    data: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
    mimeType: PropTypes.string,
  }

  static defaultProps = {
    mimeType: 'application/octet-stream',
  }

  render() {
    const { fileName, data, mimeType, ...rest } = this.props;
    return (
      <Button
        icon
        iconChildren="file_download"
        onClick={() => download(this.props.data, this.props.fileName, this.props.mimeType)}
        {...rest}
      />
    );
  }
}

export default FileDownloadButton;
