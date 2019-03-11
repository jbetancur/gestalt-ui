import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import CodeBlock from 'components/CodeBlock';
import limitRuleModel from '../models/limitRule';
import eventRuleModel from '../models/eventRule';

const PayloadViewer = memo(({ value, name }) => {
  const [raw, toggleRaw] = useState(false);
  const getValue = () => {
    if (value.resource_type === 'Gestalt::Resource::Rule::Limit') {
      return raw
        ? limitRuleModel.rawGet(value)
        : limitRuleModel.create(value);
    }

    return raw
      ? eventRuleModel.rawGet(value)
      : eventRuleModel.create(value);
  };

  return (
    <CodeBlock
      mode="json"
      value={getValue()}
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
