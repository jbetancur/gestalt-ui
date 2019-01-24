import React from 'react';
import PropTypes from 'prop-types';
import CodeBlock from 'components/CodeBlock';

const ExpanderRow = ({ data }) => <CodeBlock mode="json" maxLines={25} value={data.properties} />;

ExpanderRow.propTypes = {
  data: PropTypes.object,
};

ExpanderRow.defaultProps = {
  data: {},
};

export default ExpanderRow;
