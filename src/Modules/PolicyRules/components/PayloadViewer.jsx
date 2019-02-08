import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import CodeBlock from 'components/CodeBlock';
import limitRuleModel from '../models/limitRule';
import eventRuleModel from '../models/eventRule';

const PayloadViewer = memo(({ value, name }) => {
  const [raw, toggleRaw] = useState(0);
  const getValue = () => {
    if (value.resource_type === 'Gestalt::Resource::Rule::Limit') {
      return raw
        ? limitRuleModel.get(value)
        : limitRuleModel.initForm(value);
    }

    return raw
      ? eventRuleModel.get(value)
      : eventRuleModel.initForm(value);
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
