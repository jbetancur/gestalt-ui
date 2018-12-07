import React from 'react';
import PropTypes from 'prop-types';
import CodeBlock from 'components/CodeBlock';

const ExpanderRow = ({ data }) => <CodeBlock value={JSON.stringify(data.properties, null, 2)} />;

ExpanderRow.propTypes = {
  data: PropTypes.object,
};

ExpanderRow.defaultProps = {
  data: {},
};

export default ExpanderRow;
