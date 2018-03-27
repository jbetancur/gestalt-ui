import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';
import { Navbar, NavItem } from 'components/Navigation';
import { HierarchyIcon, MetamodelIcon, ServiceIcon, ProviderIcon, UserIcon, GroupIcon } from 'components/Icons';
import withApp from 'App/withApp';

const renderNavItems = (showOnRootOnly, t, props) => (
  [
    <NavItem
      key="hierarchy--organizations"
      title={t('organizations.title')}
      icon={<HierarchyIcon />}
      to={`/${props.match.params.fqon}/hierarchy`}
      activeClassName="active-link"
    />,
    <NavItem
      key="hierarchy--providers"
      title={t('providers.title')}
      icon={<ProviderIcon />}
      to={`/${props.match.params.fqon}/providers`}
      activeClassName="active-link"
    />,
    <NavItem
      key="hierarchy--users"
      title={t('users.title')}
      icon={<UserIcon />}
      to={`/${props.match.params.fqon}/users`}
      activeClassName="active-link"
      isVisible={showOnRootOnly}
    />,
    <NavItem
      key="hierarchy--users"
      title={t('groups.title')}
      icon={<GroupIcon />}
      to={`/${props.match.params.fqon}/groups`}
      activeClassName="active-link"
      isVisible={showOnRootOnly}
    />,
    // <NavItem
    //   key="hierarchy--micromodeler"
    //   icon={<MetamodelIcon />}
    //   title={<div><div>Micro</div><div>Modeler</div></div>}
    //   to={`/${props.match.params.fqon}/micromodeler`}
    //   activeClassName="active-link"
    //   isVisible={showOnRootOnly}
    // />,
    <NavItem
      key="hierarchy--resourceTypes"
      icon={<MetamodelIcon />}
      title="Resource Types"
      to={`/${props.match.params.fqon}/resourcetypes`}
      activeClassName="active-link"
    />,
    <NavItem
      key="hierarchy--servicemodeler"
      icon={<ServiceIcon size={24} />}
      title={<div><div>Service</div><div>Specs</div></div>}
      to={`/${props.match.params.fqon}/servicespecs`}
      activeClassName="active-link"
      isVisible={props.appState.enableExperimental}
    />,
  ]
);

const HierarchyNav = (props) => {
  const { showOnRootOnly, t } = props;

  return <Navbar vertical items={renderNavItems(showOnRootOnly, t, props)} />;
};

HierarchyNav.propTypes = {
  t: PropTypes.func.isRequired,
  showOnRootOnly: PropTypes.bool.isRequired,
};

export default compose(
  translate(),
  withRouter,
  withApp,
)(HierarchyNav);
