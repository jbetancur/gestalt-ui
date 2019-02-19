import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import CodeBlock from 'components/CodeBlock';
import lambdaModel from '../models/lambda';

const PayloadViewer = memo(({ value, name }) => {
  const [raw, toggleRaw] = useState(false);

  const data = raw
    ? lambdaModel.rawGet(value)
    : lambdaModel.create(value);

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
