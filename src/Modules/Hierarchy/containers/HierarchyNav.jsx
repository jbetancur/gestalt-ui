import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';
import { Navbar } from 'components/Navigation';
import { HierarchyIcon, MetamodelIcon, ServiceIcon, ProviderIcon, UserIcon, GroupIcon, MainframeIcon } from 'components/Icons';
import withApp from 'App/withApp';

const HierarchyNav = (props) => {
  const { match, appState, showOnRootOnly, t } = props;

  const navItems = [
    {
      key: 'hierarchy--organizations',
      title: t('organizations.title'),
      icon: <HierarchyIcon size={26} />,
      to: `/${match.params.fqon}/hierarchy`,
    },
    {
      key: 'hierarchy--providers',
      title: t('providers.title'),
      icon: <ProviderIcon size={26} />,
      to: `/${match.params.fqon}/providers`,
    },
    {
      key: 'hierarchy--users',
      title: t('users.title'),
      icon: <UserIcon size={26} />,
      to: `/${match.params.fqon}/users`,
      isVisible: showOnRootOnly,
    },
    {
      key: 'hierarchy--groups',
      title: t('groups.title'),
      icon: <GroupIcon size={26} />,
      to: `/${match.params.fqon}/groups`,
      isVisible: showOnRootOnly,
    },
    {
      key: 'hierarchy--resourceTypes',
      icon: <MetamodelIcon size={26} />,
      title: <div><div>Resource</div><div>Types</div></div>,
      to: `/${match.params.fqon}/resourcetypes`,
    },
    {
      key: 'hierarchy--servicemodeler',
      icon: <ServiceIcon size={26} />,
      title: <div><div>Service</div><div>Specs</div></div>,
      to: `/${match.params.fqon}/servicespecs`,
      isVisible: appState.enableExperimental,
    },
    {
      key: 'hierarchy--mainframe',
      icon: <MainframeIcon size={26} />,
      title: 'Cloud Frame',
      to: 'https://gtw1.test.galacticfog.com/cloud-frame-demo/ui/CloudFrame',
      isVisible: appState.enableExperimental,
    },
  ];

  return <Navbar vertical items={navItems} />;
};

HierarchyNav.propTypes = {
  t: PropTypes.func.isRequired,
  showOnRootOnly: PropTypes.bool.isRequired,
  appState: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default compose(
  translate(),
  withRouter,
  withApp,
)(HierarchyNav);
