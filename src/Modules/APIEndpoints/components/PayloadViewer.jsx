import React, { memo } from 'react';
import PropTypes from 'prop-types';
import CodeBlock from 'components/CodeBlock';
import { generatePayload } from '../payloadTransformer';

const PayloadViewer = memo(({ value, name }) => {
  const codeViewer = generatePayload(value, true);

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
};

export default PayloadViewer;
