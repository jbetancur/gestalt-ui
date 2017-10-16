import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Navbar from 'components/Navbar';
import { HierarchyIcon } from 'components/Icons';
import ListItemStacked from 'components/ListItemStacked';

const renderNavItems = (navigation, handleNavigation, showOnRootOnly, t) => (
  [
    <ListItemStacked
      key="hierarchy--organizations"
      title={t('organizations.title')}
      icon={<HierarchyIcon />}
      onClick={() => handleNavigation('hierarchy', 'hierarchy', 0)}
      className={navigation.index === 0 && 'active-link'}
    />,
    <ListItemStacked
      key="hierarchy--providers"
      title={t('providers.title')}
      icon="settings_applications"
      onClick={() => handleNavigation('hierarchy', 'providers', 1)}
      className={navigation.index === 1 && 'active-link'}
    />,
    // <ListItemStacked
    //   key="hierarchy--metamodeler"
    //   icon={<MetamodelIcon />}
    //   title={<div><div>Resource</div><div>Models</div></div>}
    //   onClick={() => handleNavigation('hierarchy', 'micro-modeler', 2)}
    //   className={navigation.index === 2 && 'active-link'}
    //   visible={showOnRootOnly}
    // />,
    <ListItemStacked
      key="hierarchy--users"
      title={t('users.title')}
      icon="person"
      onClick={() => handleNavigation('hierarchy', 'users', 3)}
      className={navigation.index === 3 && 'active-link'}
      visible={showOnRootOnly}
    />,
    <ListItemStacked
      key="hierarchy--users"
      title={t('groups.title')}
      icon="group"
      onClick={() => handleNavigation('hierarchy', 'groups', 4)}
      className={navigation.index === 4 && 'active-link'}
      visible={showOnRootOnly}
    />,
  ]
);

const HierarchyNav = (props) => {
  const { navigation, handleNavigation, showOnRootOnly, t } = props;

  return <Navbar vertical items={renderNavItems(navigation, handleNavigation, showOnRootOnly, t)} />;
};

HierarchyNav.propTypes = {
  t: PropTypes.func.isRequired,
  showOnRootOnly: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
  handleNavigation: PropTypes.func.isRequired,
};

export default translate()(HierarchyNav);
