import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AceEditor from 'react-ace';
import { SelectField, Switch } from 'react-md';
import { FileDownloadButton, ClipboardButton } from 'components/Buttons';
import 'brace/mode/yaml';
import 'brace/mode/json';
import 'brace/theme/dracula';
import 'brace/theme/monokai';
import 'brace/ext/searchbox';
import yaml from 'js-yaml';

const menuItems = [{ name: 'JSON', value: 'json' }, { name: 'YAML', value: 'yaml' }];

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-grow: 1;
  width: 100%;
  padding-left: 16px;
  padding-right: 16px;
  min-height: 52px;
`;

const ControlItem = styled.div`
  margin-left: 2px;
  margin-right: 2px;
`;

class CodeBlock extends PureComponent {
  static propTypes = {
    value: PropTypes.object.isRequired,
    mode: PropTypes.oneOf(['yaml', 'json']),
    readOnly: PropTypes.bool,
    maxLines: PropTypes.number,
    enableDownload: PropTypes.bool,
    fileName: PropTypes.string,
    enableRawOption: PropTypes.bool,
    rawLabel: PropTypes.string,
    onToggleRaw: PropTypes.func
  };

  static defaultProps = {
    mode: 'json',
    readOnly: true,
    maxLines: Infinity,
    enableDownload: false,
    fileName: null,
    enableRawOption: false,
    rawLabel: 'Raw',
    onToggleRaw: () => { },
  };

  state = {
    rawMode: false,
    currentMode: this.props.mode,
    error: '',
  }

  componentDidCatch(e) {
    this.setState({ error: e });
  }

  formatCode() {
    const { value } = this.props;
    const { currentMode } = this.state;

    if (currentMode === 'yaml' && value) {
      return yaml.safeDump(value, { skipInvalid: true });
    }

    if (currentMode === 'json' && value) {
      return JSON.stringify(value, null, 2);
    }

    return 'must be yaml or json';
  }

  handleCodeChange = (mode) => {
    this.setState({ currentMode: mode });
  }

  handleRawModeToggle = (value) => {
    const { onToggleRaw } = this.props;

    this.setState({ rawMode: value });
    onToggleRaw(value);
  }

  generateActions() {
    const { enableDownload, fileName, enableRawOption, rawLabel } = this.props;
    const { currentMode, rawMode } = this.state;
    const fileNameExt = `${fileName}.${currentMode}`;
    const buttonTiltletoolTip = ` Export ${fileName}.${currentMode}`;

    return (
      <React.Fragment>
        <ControlItem>
          <SelectField
            id="select-mode"
            menuItems={menuItems}
            itemLabel="name"
            itemValue="value"
            onChange={this.handleCodeChange}
            value={currentMode}
          />
        </ControlItem>
        {enableRawOption &&
          <ControlItem>
            <Switch
              id="raw-mode"
              name="raw-mode"
              label={rawLabel}
              checked={rawMode}
              onChange={this.handleRawModeToggle}
            />
          </ControlItem>}

        <ControlItem>
          <ClipboardButton
            showLabel={false}
            text={this.formatCode()}
            tooltipLabel="Copy to clipboard"
          />
        </ControlItem>

        {enableDownload &&
          <ControlItem>
            <FileDownloadButton
              tooltipLabel={buttonTiltletoolTip}
              data={this.formatCode()}
              fileName={fileNameExt}
            >
              Export
            </FileDownloadButton>
          </ControlItem>}
      </React.Fragment>
    );
  }

  render() {
    const { readOnly, maxLines } = this.props;
    const { currentMode } = this.state;

    const theme = currentMode === 'yaml'
      ? 'monokai'
      : 'dracula';

    return (
      <React.Fragment>
        <Controls>
          {this.generateActions()}
        </Controls>

        <AceEditor
          mode={currentMode}
          theme={theme}
          value={this.formatCode()}
          readOnly={readOnly}
          width="100%"
          height="100%"
          showPrintMargin={false}
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
          }}
          maxLines={maxLines}
        />
      </React.Fragment>
    );
  }
}

export default CodeBlock;
