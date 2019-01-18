import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import styled, { css, withTheme } from 'styled-components';
import { FontIcon } from 'react-md';
import { Button } from 'components/Buttons';
import { ALink } from 'components/Links';
import { media } from 'util/helpers/media';
import withUpgrader from '../hocs/withUpgrader';

const color = css`
  color: ${props => props.theme.colors.fontVariant};
`;

const Notification = styled.div`
  display: flex;
  flex-shrink: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 42px;
  padding-left: 8px;
  padding-right: 8px;
  background-color: ${props => props.statusColor};

  &,
  i,
  svg,
  button,
  a {
    ${color}
  }
`;

const Icon = styled(FontIcon)`
  ${() => media.xs`
    display: none;
  `};
`;

const Message = styled.div`
  padding: 8px;
  font-size: 13px;
  font-weight: 600;
  ${color}

  a {
    padding-left: 8px;
    padding-right: 4px;
    white-space: nowrap;
  }
`;

const Left = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  margin-left: 32px;
`;

const Right = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const UpgradeButton = styled(Button)`
  flex-shrink: 0;
`;

const CloseButton = styled.button`
  flex-grow: 0;
  cursor: pointer;
  outline: none;
  border: none;
  background-color: transparent;
  width: 32px;
  height: 32px;
`;

class UpgradeNotification extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    upgradeAvailable: PropTypes.object.isRequired,
    upgraderActions: PropTypes.object.isRequired,
  };

  handleUpgrade = () => {
    const { history } = this.props;

    history.push('/upgrade');
    this.handleDismiss();
  }

  handleDismiss = () => {
    const { upgraderActions } = this.props;

    upgraderActions.closeUpgradeAvailable();
  }

  determineSeverity() {
    const {
      theme,
      upgradeAvailable: { severity },
    } = this.props;

    if (severity) {
      switch (severity.toLowerCase()) {
        case 'warning':
          return theme.colors.warning;
        case 'high':
          return theme.colors.error;
        case 'critical':
          return theme.colors.error;
        default:
          return theme.colors.info;
      }
    }

    return theme.colors.info;
  }

  render() {
    const { upgradeAvailable: { upgradeAvailable, upgradeNotes, severity } } = this.props;
    const titleSeverity = severity ? `${severity[0].toUpperCase()}${severity.slice(1)}` : '';
    const status = this.determineSeverity();

    if (upgradeAvailable) {
      return (
        <Notification statusColor={status}>
          <Left>
            <Icon>whatshot</Icon>
            <Message>
              {severity && <span>{titleSeverity}: </span>}
              <span>Newer Version Available</span>
              {upgradeNotes && <ALink to={upgradeNotes} target="_blank" rel="noopener noreferrer">Release Notes</ALink>}
            </Message>
            <UpgradeButton onClick={this.handleUpgrade} flat>Upgrade</UpgradeButton>
          </Left>

          <Right>
            <CloseButton onClick={this.handleDismiss}>
              <FontIcon>close</FontIcon>
            </CloseButton>
          </Right>
        </Notification>
      );
    }

    return null;
  }
}

export default compose(
  withTheme,
  withRouter,
  withUpgrader,
)(UpgradeNotification);
