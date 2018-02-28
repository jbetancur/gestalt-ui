import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';
import { Navbar, NavItem } from 'components/Navigation';
import { HierarchyIcon, MetamodelIcon } from 'components/Icons';

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
      icon="settings_applications"
      to={`/${props.match.params.fqon}/providers`}
      activeClassName="active-link"
    />,
    <NavItem
      key="hierarchy--users"
      title={t('users.title')}
      icon="person"
      to={`/${props.match.params.fqon}/users`}
      activeClassName="active-link"
      isVisible={showOnRootOnly}
    />,
    <NavItem
      key="hierarchy--users"
      title={t('groups.title')}
      icon="group"
      to={`/${props.match.params.fqon}/groups`}
      activeClassName="active-link"
      isVisible={showOnRootOnly}
    />,
    <NavItem
      key="hierarchy--resourceTypes"
      icon={<MetamodelIcon />}
      title="Resource Types"
      to={`/${props.match.params.fqon}/resourcetypes`}
      activeClassName="active-link"
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

export default translate()(withRouter(HierarchyNav));
