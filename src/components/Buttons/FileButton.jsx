import React from 'react';
import { FileInput } from 'react-md';
import DownloadIcon from '@material-ui/icons/CloudUpload';

const FileButton = props => (
  <FileInput
    {...props}
    icon={<DownloadIcon fontSize="small" />}
  />
);

export default FileButton;
