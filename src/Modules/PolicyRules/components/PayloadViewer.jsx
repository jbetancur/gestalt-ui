import React, { memo } from 'react';
import PropTypes from 'prop-types';
import CodeBlock from 'components/CodeBlock';
import limitRuleModel from '../models/limitRule';
import eventRuleModel from '../models/eventRule';

const PayloadViewer = memo(({ value, name }) => {
  const policyValue = value.resource_type === 'Gestalt::Resource::Rule::Limit'
    ? limitRuleModel.initForm(value)
    : eventRuleModel.initForm(value);

  return (
    <CodeBlock
      mode="json"
      value={policyValue}
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
