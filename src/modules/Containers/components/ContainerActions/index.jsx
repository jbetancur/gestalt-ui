import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import Divider from 'react-md/lib/Dividers';
import ActionsModals from '../../ActionModals';

const ActionsWrapper = styled.div`
    display: inline-block;

    &.action--title {
      position: absolute;
      top: .7em;
    }

    .container--RUNNING {
      color: #4CAF50;
    }

    .container--HEALTHY {
      color: #607D8B;
    }

    .container--UNHEALTHY {
      color: #795548;
    }

    .container--SCALING {
      color: #2196F3
    }

    .container--SUSPENDED {
      color: #FFC107;
    }

    .container--LOST {
      color: #F44336;
    }

    .container--ERROR {
      color: #F44336;
    }

    .button--suspend * {
      color: #FFC107;
    }

    .button--scale * {
      color: #2196F3;
    }

    .button--destroy * {
      color: #F44336;
    }
`;

const ListWrapper = styled.div`
  min-width: 10em;
`;

const ListMenu = styled.div`
  padding-left: .5em;
  padding-right: .5em;
`;

const EnhancedDivider = styled(Divider)`
  margin: 0;
`;

class ContainerActions extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    state: PropTypes.string.isRequired,
    container: PropTypes.object.isRequired,
    deleteContainer: PropTypes.func.isRequired,
    scaleContainer: PropTypes.func.isRequired,
    scaleContainerModal: PropTypes.func.isRequired,
    migrateContainer: PropTypes.func.isRequired,
    fetchProviders: PropTypes.func.isRequired,
    migrateContainerModal: PropTypes.func.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    inContainerView: PropTypes.bool,
  }

  static defaultProps = {
    inContainerView: false,
  }

  destroyContainer() {
    const { params, confirmDelete, deleteContainer, container, inContainerView } = this.props;

    confirmDelete(() => {
      deleteContainer(params.fqon, params.environmentId, container.id, inContainerView);
    }, container.name);
  }

  suspendContainer() {
    const { params, scaleContainer, container, inContainerView } = this.props;
    scaleContainer(params.fqon, params.environmentId, container.id, 0, inContainerView);
  }

  scaleContainer() {
    const { params, scaleContainer, scaleContainerModal, container, inContainerView } = this.props;
    scaleContainerModal((numInstances) => {
      if (numInstances !== container.properties.num_instances) {
        scaleContainer(params.fqon, params.environmentId, container.id, numInstances, inContainerView);
      }
    }, container.name, container.properties.num_instances);
  }

  migrateContainer() {
    const { params, fetchProviders, migrateContainer, migrateContainerModal, container, inContainerView } = this.props;
    migrateContainerModal((providerId) => {
      migrateContainer(params.fqon, params.environmentId, container.id, providerId, inContainerView);
    }, container.name, container.properties.provider, fetchProviders, params);
  }

  render() {
    return (
      <ActionsWrapper className={this.props.inContainerView ? 'action--title' : null}>
        <ActionsModals />
        <MenuButton
          className={`container--${this.props.state}`}
          id="container-actions-menu"
          icon
          buttonChildren="more_vert"
          position="tl"
        >
          {/* https://github.com/mlaursen/react-md/issues/259 */}
          {[<ListWrapper id="container-actions-menu">
            <ListMenu>
              <div className="gf-headline-1">{this.props.container.name}</div>
              <div className="gf-subtitle">{this.props.container.properties.status}</div>
            </ListMenu>
            <EnhancedDivider />
            <ListItem className="button--suspend" primaryText="Suspend" onClick={() => this.suspendContainer()} />
            <ListItem className="button--scale" primaryText="Scale" onClick={() => this.scaleContainer()} />
            <ListItem primaryText="Migrate" onClick={() => this.migrateContainer()} />
            <ListItem className="button--destroy" primaryText="Destroy" onClick={() => this.destroyContainer()} />
          </ListWrapper>]}
        </MenuButton>
      </ActionsWrapper>
    );
  }
}

export default ContainerActions;
