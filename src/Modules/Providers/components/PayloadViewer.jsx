import React, { memo } from 'react';
import PropTypes from 'prop-types';
import CodeBlock from 'components/CodeBlock';
import { generateProviderPayload } from '../payloadTransformer';

const PayloadViewer = memo(({ value, name, hasContainer }) => {
  const codeViewer = generateProviderPayload(value, hasContainer);

  return (
    <CodeBlock
      mode="json"
      value={codeViewer}
      enableDownload
      fileName={name}
    />
  );
});

PayloadViewer.propTypes = {
  value: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  hasContainer: PropTypes.bool.isRequired,
};

export default PayloadViewer;
