import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';
import { withPickerData } from 'Modules/MetaResource';
import { SelectField } from 'react-md';
import { DotActivity } from 'components/ProgressIndicators';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from 'components/Buttons';
import { getLastFromSplit } from 'util/helpers/strings';
import iconMap from '../../Providers/config/iconMap';

class MigrateModal extends PureComponent {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    onProceed: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    sourceProvider: PropTypes.object.isRequired,
    providersData: PropTypes.array.isRequired,
    providersLoading: PropTypes.bool.isRequired,
  };

  state = { provider: '' };

  doIt = () => {
    const { modal, onProceed } = this.props;

    onProceed(this.state.provider);
    modal.hideModal();
  }

  providerChanged = (value) => {
    this.setState({ provider: value });
  }

  generateMenuItems() {
    const { providersData, sourceProvider } = this.props;

    const providers = providersData
      .filter(p => p.id !== sourceProvider.id);

    return providers.map(item => ({
      key: item.id,
      id: item.id,
      name: item.name,
      primaryText: item.name,
      secondaryText: item.description || ' ',
      leftIcon: item.resource_type ? iconMap(getLastFromSplit(item.resource_type)) : null,
    }));
  }

  render() {
    const { modal, title, providersLoading } = this.props;
    const { provider } = this.state;
    const providers = this.generateMenuItems();

    return (
      <Dialog
        id="container-migrate-modal"
        aria-labelledby="ccontainer-migrate-title"
        aria-describedby="container-migrate-description"
        open={modal.open}
        onClose={modal.hideModal}
        onExited={modal.destroyModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="ccontainer-migrate-title">{title}</DialogTitle>
        <DialogContent>
          {providersLoading ?
            <DotActivity size={1} primary /> :
            <React.Fragment>
              {providers.length ?
                <Row center>
                  <Col flex={12}>
                    <SelectField
                      id="container-migrateto"
                      label="Migrate to Provider"
                      lineDirection="center"
                      menuItems={providers}
                      simplifiedMenu={false}
                      itemLabel="name"
                      itemValue="id"
                      value={provider}
                      onChange={this.providerChanged}
                      required
                      fullWidth
                      sameWidth
                    />
                  </Col>
                </Row> : <span>There are no available providers to migrate to</span>}
            </React.Fragment>}
        </DialogContent>
        <DialogActions>
          <Button raised primary onClick={this.doIt} disabled={!provider}>Migrate</Button>
          <Button flat primary onClick={modal.hideModal}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withPickerData({
  entity: 'providers',
  label: 'Providers',
  params: { type: 'CaaS', expand: true },
})(MigrateModal);
