import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import 'brace/mode/yaml';
import 'brace/mode/json';
import 'brace/theme/dracula';

const CodeBlock = ({ value, mode, readOnly }) => (
  <AceEditor
    mode={mode}
    theme="dracula"
    value={value}
    readOnly={readOnly}
    width="100%"
    showPrintMargin={false}
    editorProps={{ $blockScrolling: true }}
  />
);

CodeBlock.propTypes = {
  value: PropTypes.string.isRequired,
  mode: PropTypes.string,
  readOnly: PropTypes.bool,
};

CodeBlock.defaultProps = {
  mode: 'json',
  readOnly: true,
};

export default CodeBlock;
