import React, { memo } from 'react';
import PropTypes from 'prop-types';
import CodeBlock from 'components/CodeBlock';
import volumeModel from '../models/volume';

const PayloadViewer = memo(({ value, name }) => (
  <CodeBlock
    mode="json"
    value={volumeModel.create(value)}
    enableDownload
    fileName={name}
  />
));

PayloadViewer.propTypes = {
  value: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
};

export default PayloadViewer;
