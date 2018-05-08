import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { Button } from 'components/Buttons';

const ErrorWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 48px;
  background: ${props => props.theme.colors['$md-red-500']};
  color: white;
  text-align: center;
  font-weight: 700;
`;

const Close = styled(Button)`
  position: absolute;
  right: 0;
`;

class ErrorMessage extends Component {
  static propTypes = {
    message: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    visible: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  };

  static defaultProps = {
    visible: false,
    message: null,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.visible !== prevState.visible) {
      return {
        visible: nextProps.visible,
      };
    }

    return null;
  }

  state = { visible: this.props.visible };

  // componentDidMount() {
  //   if (this.state.visible) {
  //     clearTimeout(this.timeout);
  //     this.timeout = setTimeout(() => this.setState({ visible: false }), 2000);
  //   }
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevProps.visible !== prevState.visible) {
  //     clearTimeout(this.timeout);
  //     this.timeout = setTimeout(() => this.setState({ visible: false }), 2000);
  //   }
  // }

  // componentWillUnmount() {
  //   clearTimeout(this.timeout);
  // }

  handleClose = () => this.setState({ visible: false });

  formatMessage() {
    const { message } = this.props;

    if (typeof message === 'object') {
      return JSON.stringify(message, null, 2);
    }

    return message;
  }

  render() {
    return (
      this.state.visible ?
        <ErrorWrapper>
          {this.formatMessage()}
          <Close icon onClick={this.handleClose}>close</Close>
        </ErrorWrapper>
        : null
    );
  }
}

export default withTheme(ErrorMessage);
