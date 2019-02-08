import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import CodeBlock from 'components/CodeBlock';
import { generateProviderPayload } from '../payloadTransformer';
import providerModel from '../models/provider';

const PayloadViewer = memo(({ value, name, hasContainer }) => {
  const [raw, toggleRaw] = useState(0);

  const data = raw
    ? providerModel.get(value)
    : generateProviderPayload(value, hasContainer);

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
  hasContainer: PropTypes.bool.isRequired,
};

export default PayloadViewer;
