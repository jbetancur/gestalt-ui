import { orderBy } from 'lodash';

const uiProviderTypes = [
  {
    name: 'Gestalt::Configuration::Provider::CaaS::DCOS',
    DCOSConfig: true,
    DCOSSecurity: true,
    networking: true,
    extraConfig: true,
    uploadConfig: false,
    allowContainer: false,
    externalProtocol: true,
    DCOSEnterprise: true,
    allowLinkedProviders: true,
    allowedRestrictEnvironments: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::CaaS::Kubernetes',
    networking: false,
    extraConfig: false,
    uploadConfig: true,
    allowContainer: false,
    externalProtocol: true,
    allowLinkedProviders: true,
    allowedRestrictEnvironments: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::CaaS::Docker',
    networking: true,
    extraConfig: false,
    uploadConfig: false,
    allowContainer: false,
    externalProtocol: true,
    allowLinkedProviders: true,
    allowedRestrictEnvironments: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Kong',
    networking: false,
    extraConfig: true,
    uploadConfig: false,
    allowContainer: true,
    externalProtocol: true,
    allowLinkedProviders: true,
    allowedRestrictEnvironments: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::GatewayManager',
    networking: false,
    extraConfig: true,
    uploadConfig: false,
    allowContainer: true,
    externalProtocol: false,
    allowLinkedProviders: true,
    allowedRestrictEnvironments: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Security',
    networking: false,
    extraConfig: false,
    uploadConfig: false,
    allowContainer: false,
    externalProtocol: false,
    allowLinkedProviders: true,
    allowedRestrictEnvironments: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Data::PostgreSQL',
    networking: false,
    extraConfig: false,
    uploadConfig: false,
    allowContainer: false,
    externalProtocol: false,
    allowLinkedProviders: true,
    allowedRestrictEnvironments: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Messaging::RabbitMQ',
    networking: false,
    extraConfig: false,
    uploadConfig: false,
    allowContainer: false,
    externalProtocol: false,
    allowLinkedProviders: true,
    allowedRestrictEnvironments: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Policy',
    networking: false,
    extraConfig: false,
    uploadConfig: false,
    allowContainer: true,
    externalProtocol: false,
    allowLinkedProviders: true,
    allowedRestrictEnvironments: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Logging',
    networking: false,
    extraConfig: false,
    uploadConfig: false,
    allowContainer: true,
    externalProtocol: false,
    allowLinkedProviders: true,
    allowedRestrictEnvironments: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::GestaltFlink',
    networking: false,
    extraConfig: false,
    uploadConfig: false,
    allowContainer: true,
    externalProtocol: false,
    allowLinkedProviders: true,
    allowedRestrictEnvironments: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda',
    allowContainer: true,
    externalProtocol: false,
    allowLinkedProviders: true,
    allowedRestrictEnvironments: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda::Executor::NodeJS',
    allowLinkedProviders: true,
    allowedRestrictEnvironments: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda::Executor::Nashorn',
    allowLinkedProviders: true,
    allowedRestrictEnvironments: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda::Executor::Scala',
    allowLinkedProviders: true,
    allowedRestrictEnvironments: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda::Executor::Java',
    allowLinkedProviders: true,
    allowedRestrictEnvironments: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda::Executor::Ruby',
    allowLinkedProviders: true,
    allowedRestrictEnvironments: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda::Executor::Python',
    allowLinkedProviders: true,
    allowedRestrictEnvironments: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda::Executor::CSharp',
    allowLinkedProviders: true,
    allowedRestrictEnvironments: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda::Executor::GoLang',
    allowLinkedProviders: true,
    allowedRestrictEnvironments: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda::Executor::Bash',
    allowLinkedProviders: true,
    allowedRestrictEnvironments: true,
  },
];

const blacklistAbstracts = [
  'Gestalt::Configuration::Provider::ActionProvider',
  'Gestalt::Configuration::Provider::Messaging',
  'Gestalt::Configuration::Provider::Lambda::Executor',
  'Gestalt::Resource::DataContainer',
  'Gestalt::Configuration::Provider::Data',
  'Gestalt::Configuration::Provider::CaaS',
  'Gestalt::Configuration::Provider',
  'Gestalt::Resource',
  'Gestalt::Resource::Runnable',
  'Gestalt::Resource::ResourceContainer',
];

export const generateResourceTypeSchema = (resourceTypes) => {
  // Ideally instead of blacklisting use properties.abstract, however it is always true.
  const list = resourceTypes
    .filter(r => r.name !== blacklistAbstracts.find(bl => bl === r.name))
    .map(r => ({
      id: r.id,
      displayName: r.name.replace('Gestalt::Configuration::Provider::', ''),
      name: r.name,
      type: r.name,
      allowedRestrictEnvironments: true,
      ...uiProviderTypes.find(i => i.name === r.name)
    }));

  return orderBy(list, 'displayName');
};
