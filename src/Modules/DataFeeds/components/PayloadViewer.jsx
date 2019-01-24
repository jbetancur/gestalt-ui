import React, { memo } from 'react';
import PropTypes from 'prop-types';
import CodeBlock from 'components/CodeBlock';
import dataFeedModel from '../models/dataFeed';

const PayloadViewer = memo(({ value, name }) => (
  <CodeBlock
    mode="json"
    value={dataFeedModel.create(value)}
    enableDownload
    fileName={name}
  />
));

PayloadViewer.propTypes = {
  value: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
};

export default PayloadViewer;
