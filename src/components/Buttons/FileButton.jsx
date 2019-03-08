import React from 'react';
import { FileInput } from 'react-md';
import styled from 'styled-components';
import DownloadIcon from '@material-ui/icons/CloudUpload';

const IconStyle = styled(DownloadIcon)`
  height: 18px;
  width: 18px;
  margin-top: -2px;
  margin-left: 5px;
`;

const FileButton = props => (
  <FileInput
    {...props}
    icon={<IconStyle fontSize="small" />}
  />
);

export default FileButton;
