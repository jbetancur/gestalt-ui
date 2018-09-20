import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FontIcon } from 'react-md';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import Div from 'components/Div';
import { Title } from 'components/Typography';
import { Button } from 'components/Buttons';
import { DeleteIcon } from 'components/Icons';
import { ALink } from 'components/Links';
import VolumeCreateMenu from '../components/VolumeCreateMenu';
import actions from '../actions';
import { selectVolumeListing } from '../selectors';

class VolumePanel extends PureComponent {
  static propTypes = {
    volumes: PropTypes.array.isRequired,
    showVolumeCreateModal: PropTypes.func.isRequired,
    selectedProvider: PropTypes.object.isRequired,
    editMode: PropTypes.bool,
    volumeListing: PropTypes.array.isRequired,
    setVolumes: PropTypes.func.isRequired,
    removeVolume: PropTypes.func.isRequired,
    unloadVolumes: PropTypes.func.isRequired,
  };

  static defaultProps = {
    editMode: false,
  };

  componentDidMount() {
    const { setVolumes, volumes } = this.props;

    setVolumes(volumes);
  }

  componentWillUnmount() {
    const { unloadVolumes } = this.props;

    unloadVolumes();
  }

  formatActionState = (row) => {
    if (row.volume_resource.properties
      && row.volume_resource.properties.container
      && row.volume_resource.properties.container.id) {
      return 'Attached';
    }

    if (row.volume_id &&
      row.volume_resource &&
      row.volume_resource.id) {
      return 'Attach';
    }

    return 'Create';
  }

  handleMenuSelect = (mode) => {
    const { showVolumeCreateModal, selectedProvider, volumes } = this.props;

    showVolumeCreateModal(mode, selectedProvider, volumes);
  }

  handleDetach = row => () => {
    const { removeVolume } = this.props;

    removeVolume(row);
  }

  defineColumns() {
    const { match, editMode } = this.props;

    // only show link cell in editMode or for existing
    const cell = {
      cell: row => (editMode && row.volume_resource && row.volume_resource.id
        ?
          <ALink
            to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/volumes/${row.volume_resource.id}`}
            primary
          >
            {row.volume_resource.name}
          </ALink>
        :
        row.volume_resource.name)
    };

    return [
      {
        name: 'Action',
        selector: 'action',
        sortable: true,
        format: this.formatActionState,
      },
      {
        name: 'Volume Name',
        selector: 'volume_resource.name',
        sortable: true,
        ...cell,
      },
      {
        name: 'Type',
        selector: 'volume_resource.properties.type',
        sortable: true,
      },
      {
        name: 'Mount Path',
        selector: 'mount_path',
        sortable: true,
      },
      {
        name: 'Size (MiB)',
        selector: 'volume_resource.properties.size',
        sortable: true,
        right: true,
      },
      {
        name: 'Access Mode',
        selector: 'volume_resource.properties.access_mode',
        sortable: true,
      },
      {
        grow: 0,
        width: '55px',
        compact: true,
        allowOverflow: true,
        ignoreRowClick: true,
        cell: row => (
          <Button
            id={row.id}
            icon
            tooltipLabel="Detach this volume"
            tooltipPosition="left"
            onClick={this.handleDetach(row)}
          >
            <DeleteIcon />
          </Button>
        ),
      },
    ];
  }

  render() {
    const { volumeListing, ...rest } = this.props;

    return (
      <div>
        <Div padding="8px" paddingLeft="16px">
          <VolumeCreateMenu onSelect={this.handleMenuSelect} {...rest} />
        </Div>
        <Row>
          <Col flex={12}>
            <DataTable
              noHeader
              data={volumeListing}
              // highlightOnHover
              sortIcon={<FontIcon>arrow_downward</FontIcon>}
              defaultSortField="name"
              columns={this.defineColumns()}
              noDataComponent={<Title light>There are no volumes to display</Title>}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  volumeListing: selectVolumeListing(state),
});

export default compose(
  connect(mapStateToProps, actions),
  withRouter,
)(VolumePanel);
