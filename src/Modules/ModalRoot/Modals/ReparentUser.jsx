import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Row, Col } from 'react-flexybox';
import { DialogContainer, Checkbox, SelectionControlGroup, List, ListItem } from 'react-md';
import { Button } from 'components/Buttons';
import { Title, Caption } from 'components/Typography';
import { Search } from 'Modules/Search';

const EnhancedDialog = styled(DialogContainer)`
  .md-dialog {
    width: 100%;
    max-width: 32em;
    word-wrap: break-word;
  }

  .md-dialog-footer--inline {
    position: relative;
    align-items: center;
  }
`;

const Options = styled.div`
  display: inline-block;
  position: absolute;
  left: 0;
  top: 5px;
`;

const ListRow = styled(Row)`
  max-height: 12em;
  overflow: scroll;

  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
`;

class ReparentModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onProceed: PropTypes.func,
    hideModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    onClose: PropTypes.func,
    multipleItems: PropTypes.array,
  };

  static defaultProps = {
    onProceed: null,
    onClose: null,
    multipleItems: [],
  };

  state = {
    entity: 'users',
    reparent: false,
    force: false,
    reparentTargetValue: null,
    reparentTargetName: null,
  };

  close = () => {
    const { hideModal, onClose } = this.props;
    hideModal();

    if (onClose) {
      onClose();
    }
  }

  doIt = () => {
    const { onProceed, hideModal } = this.props;
    const { force, reparent, reparentTargetValue } = this.state;

    if (reparent) {
      onProceed({ force: true, parent: reparentTargetValue });
    } else {
      onProceed({ force });
    }

    hideModal();
  }

  handleForceChecked = () => {
    this.setState(prevState => ({ force: !prevState.force }));
  }

  handleEntity = (value) => {
    this.setState({ entity: value });
  }

  handleReparent = () => {
    this.setState(prevState => ({ reparent: !prevState.reparent }));
  }

  handleReparentTarget = (value, item) => {
    this.setState({
      reparentTargetValue: value,
      reparentTargetName: item.name,
    });
  }

  renderActions() {
    const { reparent, reparentTargetValue } = this.state;

    const actionButtons = [];
    actionButtons.push(
      <Options>
        {!reparent &&
          <Checkbox
            id="confirmation-modal--force-delete"
            name="confirmation-modal--force-delete"
            label="Force Delete"
            inline
            onChange={this.handleForceChecked}
          />}
      </Options>
    );
    actionButtons.push(<Button flat important disabled={reparent && !reparentTargetValue} onClick={this.doIt}>{reparent ? 'Transfer & Delete' : 'Delete'}</Button>);
    actionButtons.push(<Button flat primary onClick={this.close}>Cancel</Button>);

    return actionButtons;
  }

  render() {
    const { visible, title, multipleItems } = this.props;
    const { entity, reparent, reparentTargetName } = this.state;
    const items = multipleItems.map((item, i) => (
      <ListItem key={i} inkDisabled primaryText={item} />
    ));

    return (
      <EnhancedDialog
        id="confirmation-modal"
        contentStyle={{ maxHeight: '30em', overflow: 'visible' }}
        visible={visible}
        title={title}
        defaultVisibleTransitionable
        onHide={this.close}
        actions={this.renderActions()}
      >
        {multipleItems.length > 0 &&
          <ListRow>
            <Col flex={12}>
              <List>{items}</List>
            </Col>
          </ListRow>}

        <Row gutter={5} padding={multipleItems.length ? '16px' : 0}>
          <Col flex={12}>
            <Checkbox
              id="confirmation-modal--reparent"
              name="confirmation-modal--reparent"
              label="Transfer Ownership"
              onChange={this.handleReparent}
            />

            <Caption>Optionally transfer ownership of assets to another user or organization</Caption>
          </Col>
          {reparent &&
            <React.Fragment>
              <Col flex={5}>
                <SelectionControlGroup
                  id="selection-control-group-search-type"
                  name="selection-control-group-search-type"
                  type="radio"
                  defaultValue="users"
                  onChange={this.handleEntity}
                  controls={[{
                    label: 'User',
                    value: 'users',
                  }, {
                    label: 'Organization',
                    value: 'orgs',
                  }]}
                />
              </Col>

              <Col flex={7}>
                <Search
                  entity={entity}
                  searchLabel={`search ${entity} to transfer to`}
                  onResult={this.handleReparentTarget}
                  userSearch={this.state.entity === 'users'}
                />
              </Col>

              {reparentTargetName &&
              <Col flex={12}>
                <Title>Transfer ownership to:</Title>
                <Title light>{reparentTargetName}</Title>
              </Col>}
            </React.Fragment>}
        </Row>
      </EnhancedDialog>
    );
  }
}

const actions = dispatch => ({
  hideModal: () => {
    dispatch({ type: 'HIDE_MODAL' });
  }
});

export default compose(
  connect(null, actions),
)(ReparentModal);
