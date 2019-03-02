import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { get } from 'lodash';
import memoize from 'memoize-one';
import { generateContextEntityState } from 'util/helpers/context';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { SelectFilter } from 'Modules/ListFilter';
import { ModalConsumer } from 'Modules/ModalRoot/ModalContext';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Name, Timestamp, Endpoints, NoData } from 'components/TableCells';
import { LinearProgress } from 'components/ProgressIndicators';
import { Card } from 'components/Cards';
import { FontIcon } from 'react-md';
import { StatusBubble } from 'components/Status';
import { ContainerIcon as CIcon } from 'components/Icons';
import { Button } from 'components/Buttons';
import { getLastFromSplit, truncate } from 'util/helpers/strings';
import ImportModal from '../ActionModals/Import';
import actions from '../actions';
import ContainerActions from './ContainerActions';
import iconMap from '../../Providers/config/iconMap';
import withContainers from '../hocs/withContainers';

const SubHeaderSection = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const ContainerOption = styled.div`
  display: flex;
  flex-shrink: 0;
`;

const tableTheme = {
  rows: {
    fontSize: '12px',
  }
};

class ContainerListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    containers: PropTypes.array.isRequired,
    containersPending: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    containersActions: PropTypes.object.isRequired,
    providerContext: PropTypes.bool,
  };

  static defaultProps = {
    providerContext: false,
  };

  static contextType = ModalConsumer;

  state = {
    showSystemContainers: false,
  }

  filteredContainers = memoize((containers, showSystem) => (
    // note that labels is a map on the original payload
    showSystem
      ? containers
      : containers.filter(container => !get(container, 'properties.labels.gestalt-system-managed'))
  ));

  componentDidMount() {
    const { match, containersActions } = this.props;
    const entity = generateContextEntityState(match.params);

    containersActions.fetchContainers({
      fqon: match.params.fqon, entityId: entity.id, entityKey: entity.key, params: { embed: 'apiendpoints' }, enablePolling: true
    });
  }

  handleRowClicked = (row) => {
    const { history, match } = this.props;
    const isJob = row.resource_type === 'Gestalt::Resource::Job';

    // use query parms to determined isJob
    history.push({ pathname: `${match.url}/${row.id}`, search: `?isJob=${isJob}` });
  }

  showImportModal = () => {
    const { match } = this.props;
    const { showModal } = this.context;

    showModal(ImportModal, {
      title: 'Import Container',
      fqon: match.params.fqon,
      environmentId: match.params.environmentId,
    });
  }

  defineColumns() {
    const { match } = this.props;
    return [
      {
        width: '56px',
        button: true,
        allowOverflow: true,
        ignoreRowClick: true,
        cell: (row) => {
          const isJob = row.resource_type === 'Gestalt::Resource::Job';

          return (
            <ContainerActions
              containerModel={row}
              editURL={`${match.url}/${row.id}`}
              disablePromote={isJob}
              disableMigrate={isJob}
              disableScale={isJob}
              disableEntitlements={isJob}
              disableClone={isJob}
              {...this.props}
            />
          );
        }
      },
      {
        name: 'Status',
        selector: 'properties.status',
        sortable: true,
        allowOverflow: true,
        minWidth: '140px',
        cell: row => (
          <StatusBubble
            status={row.properties.status}
            statusDetail={row.properties.status_detail}
          />
        ),
      },
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        grow: 2,
        cell: row => <Name name={row.name} description={row.description} />
      },
      {
        name: 'Endpoints',
        selector: 'properties.apiendpoints',
        ignoreRowClick: true,
        grow: 2,
        cell: row => <Endpoints endpoints={row.properties.apiendpoints} />
      },
      {
        name: 'Provider',
        selector: 'properties.provider.name',
        sortable: true,
        minWidth: '50px',
        format: row => truncate(row.properties.provider.name, 30),
      },
      {
        name: 'Image',
        selector: 'properties.image',
        sortable: true,
        minWidth: '50px',
        format: row => truncate(row.properties.image, 25),
      },
      {
        name: 'Platform',
        selector: 'properties.provider.resource_type',
        sortable: true,
        center: true,
        compact: true,
        width: '60px',
        cell: row => iconMap(getLastFromSplit(row.properties.provider.resource_type)),
      },
      {
        name: 'Instances',
        selector: 'properties.num_instances',
        sortable: true,
        right: true,
        compact: true,
        grow: 0,
        minWidth: '80px',
        cell: row => <div>{row.properties.instances && `${row.properties.instances.length} / ${row.properties.num_instances}`}</div>
      },
      // {
      //   name: 'Job',
      //   selector: 'resource_type',
      //   sortable: true,
      //   center: true,
      //   button: true,
      //   cell: row => <Checkbox inkDisabled checked={row.resource_type === 'Gestalt::Resource::Job'} disabled />
      // },
      {
        name: 'CPU',
        selector: 'properties.cpus',
        sortable: true,
        right: true,
        compact: true,
        grow: 0,
        minWidth: '50px',
      },
      {
        name: 'Mem',
        selector: 'properties.memory',
        sortable: true,
        right: true,
        compact: true,
        grow: 0,
        minWidth: '50px',
      },
      {
        name: 'Created',
        selector: 'created.timestamp',
        sortable: true,
        allowOverflow: true,
        wrap: true,
        cell: row => <Timestamp timestamp={row.created.timestamp} />
      },
    ];
  }

  toggleSystemContainers = (event) => {
    this.setState({ showSystemContainers: event.target.checked });
  }

  render() {
    const { containers, containersPending } = this.props;
    const { showSystemContainers } = this.state;

    return (
      <Row gutter={5}>
        <Col flex={12}>
          <Card>
            <DataTable
              title="Containers"
              customTheme={tableTheme}
              data={this.filteredContainers(containers, showSystemContainers)}
              highlightOnHover
              pointerOnHover
              sortIcon={<FontIcon>arrow_downward</FontIcon>}
              defaultSortField="name"
              progressPending={containersPending}
              progressComponent={<LinearProgress id="container-listing" />}
              columns={this.defineColumns()}
              noDataComponent={<NoData message="There are no containers to display" icon={<CIcon size={150} />} />}
              onRowClicked={this.handleRowClicked}
              actions={(
                <SubHeaderSection>
                  <SelectFilter disabled={containersPending} />
                </SubHeaderSection>
              )}
              subHeader
              subHeaderComponent={
                <React.Fragment>
                  <ContainerOption>
                    <FormControlLabel
                      control={(
                        <Switch
                          id="raw-mode"
                          name="raw-mode"
                          checked={showSystemContainers}
                          onChange={this.toggleSystemContainers}
                          color="primary"
                        />)}
                      label="Show Jobs"
                    />
                  </ContainerOption>
                  <Button flat primary onClick={this.showImportModal}>Import</Button>
                </React.Fragment>
              }
              pagination
              paginationPerPage={15}
              // expandableRowsComponent={<ContainerListingExpandable />}
            />
          </Card>
        </Col>
      </Row>
    );
  }
}

export default compose(
  withContainers(),
  connect(null, actions),
)(ContainerListing);
