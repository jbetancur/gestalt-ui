
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { AceEditor } from 'components/ReduxFormFields';
import { SelectField } from 'react-md';
import { Button } from 'components/Buttons';
import { Panel } from 'components/Panels';
import withLambdaState from '../hoc/withLambdaState';

const themes = ['chrome', 'dracula', 'monokai'];
const keyBindings = [{ name: 'default', value: 'ace' }, { name: 'vim', value: 'vim' }, { name: 'emacs', value: 'emacs' }];

const FullScreenWrapper = styled(({ isFullScreen, ...rest }) => <div {...rest} />)`
  ${props => props.isFullScreen && css`
    z-index: 20;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: white;
    height: 100vh;
    overflow: scroll;
    padding: 0;
  `}
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  padding-left: 16px;
  padding-right: 8px;
`;

const Options = styled.div`
  flex: 1 1 auto;

  > :first-child {
    margin-right: 10px;
  }
`;

const Buttons = styled(({ isFullScreen, ...rest }) => <div {...rest} />)`
  flex: 1 1 auto;
  display: flex;
  justify-content: flex-end;

  button {
    margin-left: 5px;
    margin-right: 5px;
  }

  ${props => props.isFullScreen && css`
    position: fixed;
    top: 8px;
    right: 16px;
    padding: 3px;
    background: rgb(33, 150, 243, 0.14);
    border-radius: 5px;
    z-index: 21;
  `};
`;

const Editor = styled.div`
  width: 100%;
`;

class LambdaSourceSection extends PureComponent {
  static propTypes = {
    selectedRuntime: PropTypes.object.isRequired,
    onSave: PropTypes.func,
    formValues: PropTypes.object.isRequired,
  };

  static defaultProps = {
    onSave: null,
  };

  constructor() {
    super();

    const storedTheme = localStorage.getItem('gf-editor-theme') || 'chrome';
    const storedBinding = localStorage.getItem('gf-editor-keybinding') || 'ace';

    this.state = {
      fullscreen: false,
      theme: storedTheme,
      keyBinding: storedBinding,
    };
  }

  handleFullScreen = () => {
    this.setState({ fullscreen: !this.state.fullscreen });
  }

  handleTheme = (theme) => {
    localStorage.setItem('gf-editor-theme', theme);
    this.setState({ theme });
  }

  handleKeyBinding = (keyBinding) => {
    localStorage.setItem('gf-editor-keybinding', keyBinding);
    this.setState({ keyBinding });
  }

  handleOnSave = () => {
    this.props.onSave(this.props.formValues);
  }

  render() {
    const { selectedRuntime, onSave } = this.props;
    const maxLines = this.state.fullscreen ? Infinity : 50;
    const keyBinding = this.state.keyBinding === 'ace' ? null : this.state.keyBinding;

    return (
      <Row gutter={5}>
        <Col flex={12}>
          <Panel title="Source Code" noPadding>
            <FullScreenWrapper isFullScreen={this.state.fullscreen}>
              <HeaderControls>
                <Options>
                  <SelectField
                    id="select-code-theme"
                    label="Editor Theme"
                    menuItems={themes}
                    onChange={this.handleTheme}
                    value={this.state.theme}
                  />

                  <SelectField
                    id="select-code-Keybinding"
                    label="Key Binding"
                    menuItems={keyBindings}
                    onChange={this.handleKeyBinding}
                    itemLabel="name"
                    itemValue="value"
                    value={this.state.keyBinding}
                  />
                </Options>

                <Buttons isFullScreen={this.state.fullscreen}>
                  {onSave && this.state.fullscreen &&
                    <Button
                      icon
                      primary
                      onClick={this.handleOnSave}
                      tooltipLabel="Save"
                      tooltipPosition="left"
                    >
                      save
                    </Button>}

                  <Button
                    icon
                    primary
                    onClick={this.handleFullScreen}
                    tooltipLabel={this.state.fullscreen ? 'Exit Full Screen' : 'Full Screen'}
                    tooltipPosition="left"
                    // iconChildren={this.state.fullscreen ? 'fullscreen_exit' : 'fullscreen'}
                  >
                    {this.state.fullscreen ? 'close' : 'fullscreen'}
                  </Button>
                </Buttons>
              </HeaderControls>

              <Editor isFullScreen={this.state.fullscreen}>
                <Field
                  name="properties.code"
                  component={AceEditor}
                  maxLines={maxLines}
                  minLines={15}
                  mode={selectedRuntime.codeFormat}
                  theme={this.state.theme}
                  keyboardHandler={keyBinding}
                />
              </Editor>
            </FullScreenWrapper>
          </Panel>
        </Col>
      </Row>
    );
  }
}

export default withLambdaState(LambdaSourceSection);
