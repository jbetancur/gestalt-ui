import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import CodeBlock from 'components/CodeBlock';
import providerModel from '../models/provider';

const PayloadViewer = memo(({ value, name, providerType }) => {
  const [raw, toggleRaw] = useState(false);

  const formatPayload = () => {
    // use the correct model to format the provider payload
    if (providerType.model) {
      const data = raw
        ? providerType.model.rawGet(value)
        : providerType.model.create(value);

      return data;
    }

    return raw
      ? providerModel.rawGet(value)
      : providerModel.create(value);
  };

  return (
    <CodeBlock
      mode="json"
      value={formatPayload()}
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
  providerType: PropTypes.object,
};

PayloadViewer.defaultProps = {
  providerType: {},
};

export default PayloadViewer;
