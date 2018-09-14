import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FontIcon } from 'react-md';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import Div from 'components/Div';
import { Title } from 'components/Typography';
import { Button } from 'components/Buttons';
import { DeleteIcon } from 'components/Icons';
import VolumeCreateMenu from '../components/VolumeCreateMenu';
import actions from '../actions';
import { selectVolumeListing } from '../selectors';

class VolumePanelList extends PureComponent {
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
    const { editMode } = this.props;

    if (editMode && row.volume_id && row.volume_resource.id) {
      return 'Attached';
    }

    return row.volume_id ? 'Attach' : 'Create';
  }

  handleMenuSelect = (mode) => {
    const { showVolumeCreateModal, selectedProvider } = this.props;

    showVolumeCreateModal(mode, selectedProvider);
  }

  handleDetach = row => () => {
    const { removeVolume } = this.props;

    removeVolume(row);
  }

  defineColumns() {
    return [
      {
        name: 'Action',
        selector: 'action',
        sortable: true,
        format: this.formatActionState,
      },
      {
        name: 'Name',
        selector: 'volume_resource.name',
        sortable: true,
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
        width: '100px',
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
              highlightOnHover
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
)(VolumePanelList);
