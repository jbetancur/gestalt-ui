import React from 'react';
import 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/sh';
import 'brace/mode/javascript';
import 'brace/mode/java';
import 'brace/mode/csharp';
import 'brace/mode/golang';
import 'brace/mode/python';
import 'brace/mode/ruby';
import 'brace/mode/yaml';
import 'brace/mode/json';
import 'brace/mode/scala';
import 'brace/theme/chrome';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';

const aceOnBlur = onBlur => (_event, editor) => {
  const value = editor.getValue();
  onBlur(value);
};

/* eslint-disable react/prop-types */
export default ({ input, className, ...others }) => (
  <AceEditor
    name={input.name}
    onBlur={aceOnBlur(input.onBlur)}
    onChange={input.onChange}
    onFocus={input.onFocus}
    value={input.value}
    className={className}
    tabSize={2}
    width="100%"
    height="100%"
    wrapEnabled
    showPrintMargin={false}
    highlightActiveLine={true}
    enableBasicAutocompletion={true}
    setOptions={{
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
    }}
    editorProps={{ $blockScrolling: Infinity }}
    {...others}
  />
);
