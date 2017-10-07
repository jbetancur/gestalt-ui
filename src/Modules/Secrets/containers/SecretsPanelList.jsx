import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow } from 'components/Tables';
import { FieldRemoveButton } from 'components/Buttons';
import actions from '../actions';

class SecretsPanelListing extends Component {
  static propTypes = {
    secrets: PropTypes.array.isRequired,
    mergeSecrets: PropTypes.array,
    addSecret: PropTypes.func.isRequired,
    removeSecret: PropTypes.func.isRequired,
    unloadSecretsModal: PropTypes.func.isRequired,
    editMode: PropTypes.bool,
  };

  static defaultProps = {
    mergeSecrets: [],
    editMode: false,
  };

  componentDidMount() {
    this.props.mergeSecrets.forEach(s => this.props.addSecret(s));
  }

  componentWillUnmount() {
    // if we dont unload state in editMode, merged entries from the container begin to stack up on unload
    if (this.props.editMode) {
      this.props.unloadSecretsModal();
    }
  }

  renderRows(secrets) {
    return secrets.map((item, i) => (
      <TableRow key={i}>
        <TableColumn>{item.mount_type}</TableColumn>
        <TableColumn>{item.secret_name || item.secret_id}</TableColumn>
        <TableColumn>{item.secret_key}</TableColumn>
        <TableColumn>{item.path}</TableColumn>
        <TableColumn><FieldRemoveButton onClick={() => this.props.removeSecret(item)} inTable /></TableColumn>
      </TableRow>
    ));
  }

  render() {
    const secrets = this.props.secrets;

    return (
      <DataTable plain>
        {secrets.length > 0 &&
          <TableHeader>
            <TableRow>
              <TableColumn>Mount Type</TableColumn>
              <TableColumn>Secret</TableColumn>
              <TableColumn>Secret Key</TableColumn>
              <TableColumn>Path</TableColumn>
              <TableColumn />
            </TableRow>
          </TableHeader>}
        <TableBody>
          {this.renderRows(secrets)}
        </TableBody>
      </DataTable>
    );
  }
}

function mapStateToProps(state) {
  return {
    secretPanelModal: state.secrets.secretPanelModal,
    secrets: state.secrets.secrets.secrets,
  };
}

export default connect(mapStateToProps, actions)(SecretsPanelListing);
