import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Row, Col } from 'react-flexybox';
import { SelectionControlGroup } from 'react-md';
import Checkbox from 'components/Fields/Checkbox';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from 'components/Buttons';
import { Title } from 'components/Typography';
import { Search } from 'Modules/Search';

const DialogContentSCroller = styled(DialogContent)`
  padding: 24px 0 24px 0 !important;
  max-height: 200px !important;
`;

class ReparentModal extends PureComponent {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    onProceed: PropTypes.func,
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
    const { modal, onClose } = this.props;
    modal.hideModal();

    if (onClose) {
      onClose();
    }
  }

  doIt = () => {
    const { onProceed, modal } = this.props;
    const { force, reparent, reparentTargetValue } = this.state;

    if (reparent) {
      onProceed({ force: true, parent: reparentTargetValue });
    } else {
      onProceed({ force });
    }

    modal.hideModal();
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

  render() {
    const { modal, title, multipleItems } = this.props;
    const { entity, reparent, reparentTargetName, reparentTargetValue } = this.state;
    const modalTitle = multipleItems.length > 1
      ? `${title} (${multipleItems.length})`
      : title;

    return (
      <Dialog
        id="confirmation-modal"
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-description"
        open={modal.open}
        onClose={this.close}
        onExited={modal.destroyModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="confirmation-modal-title">{modalTitle}</DialogTitle>

        {multipleItems.length > 0 && (
          <DialogContentSCroller>
            {multipleItems.map((item, i) => (
              <ListItem key={i}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </DialogContentSCroller>
        )}

        <DialogContent>
          <DialogContentText>
            <Checkbox
              id="confirmation-modal--reparent"
              name="confirmation-modal--reparent"
              label="Transfer Ownership"
              onChange={this.handleReparent}
            />

            <span>Optionally transfer ownership of assets to another user or organization</span>

            <Row gutter={10} padding="16px">
              {reparent && (
                <Col flex={5}>
                  <SelectionControlGroup
                    id="selection-control-group-search-type"
                    name="selection-control-group-search-type"
                    type="radio"
                    defaultValue="users"
                    onChange={this.handleEntity}
                    inline
                    controls={[{
                      label: 'User',
                      value: 'users',
                    }, {
                      label: 'Organization',
                      value: 'orgs',
                    }]}
                  />
                </Col>
              )}

              {reparent && (
                <Col flex={7}>
                  <Search
                    entity={entity}
                    searchLabel={`search ${entity} to transfer to`}
                    onResult={this.handleReparentTarget}
                    userSearch={this.state.entity === 'users'}
                  />
                </Col>
              )}
            </Row>

            {reparentTargetName && <React.Fragment><span>Transfer ownership to: </span><Title>{reparentTargetName}</Title></React.Fragment>}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          {!reparent &&
            <Checkbox
              id="confirmation-modal--force-delete"
              name="confirmation-modal--force-delete"
              label="Force Delete"
              inline
              onChange={this.handleForceChecked}
              fullWidth
            />}
          <Button raised important disabled={reparent && !reparentTargetValue} onClick={this.doIt}>{reparent ? 'Transfer & Delete' : 'Delete'}</Button>
          <Button flat primary onClick={this.close}>Cancel</Button>
        </DialogActions>
      </Dialog>
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
