import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import CodeBlock from 'components/CodeBlock';
import { generatePayload } from '../payloadTransformer';
import containerModel from '../models/container';

const PayloadViewer = memo(({ value, name }) => {
  const [raw, toggleRaw] = useState(0);

  const data = raw
    ? containerModel.get(value)
    : generatePayload(value);

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
