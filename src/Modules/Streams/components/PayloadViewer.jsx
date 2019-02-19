import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import CodeBlock from 'components/CodeBlock';
import streamModel from '../models/streamSpec';

const PayloadViewer = memo(({ value, name }) => {
  const [raw, toggleRaw] = useState(0);

  const data = raw
    ? streamModel.get(value)
    : streamModel.create(value);

  return (
    <CodeBlock
      mode="json"
      value={data}
      enableDownload
      fileName={name}
      enableRawOption
      onToggleRaw={() => toggleRaw(!raw)}
    />
  );
});

PayloadViewer.propTypes = {
  value: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
};

export default PayloadViewer;
