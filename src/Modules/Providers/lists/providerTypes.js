import { orderBy } from 'lodash';

const uiProviderTypes = [
  {
    name: 'Gestalt::Configuration::Provider::CaaS::DCOS',
    DCOSConfig: true,
    extraConfig: true,
    uploadConfig: false,
    allowContainer: false,
    allowLinkedProviders: true,
    allowEnvVariables: false,
  },
  {
    name: 'Gestalt::Configuration::Provider::CaaS::Kubernetes',
    extraConfig: false,
    uploadConfig: true,
    allowContainer: false,
    allowLinkedProviders: true,
    allowEnvVariables: false,
  },
  {
    name: 'Gestalt::Configuration::Provider::CaaS::Docker',
    extraConfig: false,
    uploadConfig: false,
    allowContainer: false,
    allowLinkedProviders: true,
    allowEnvVariables: false,
  },
  {
    name: 'Gestalt::Configuration::Provider::Kong',
    extraConfig: true,
    uploadConfig: false,
    allowContainer: true,
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::GatewayManager',
    extraConfig: true,
    uploadConfig: false,
    allowContainer: true,
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Security',
    extraConfig: false,
    uploadConfig: false,
    allowContainer: false,
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Data::PostgreSQL',
    extraConfig: false,
    uploadConfig: false,
    allowContainer: false,
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Messaging::RabbitMQ',
    extraConfig: false,
    uploadConfig: false,
    allowContainer: false,
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Policy',
    extraConfig: false,
    uploadConfig: false,
    allowContainer: true,
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Logging',
    extraConfig: false,
    uploadConfig: false,
    allowContainer: true,
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::GestaltFlink',
    extraConfig: false,
    uploadConfig: false,
    allowContainer: true,
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda',
    allowContainer: true,
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda::Executor::NodeJS',
    allowLinkedProviders: false,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda::Executor::Nashorn',
    allowLinkedProviders: false,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda::Executor::Scala',
    allowLinkedProviders: false,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda::Executor::Java',
    allowLinkedProviders: false,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda::Executor::Ruby',
    allowLinkedProviders: false,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda::Executor::Python',
    allowLinkedProviders: false,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda::Executor::CSharp',
    allowLinkedProviders: false,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda::Executor::GoLang',
    allowLinkedProviders: false,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda::Executor::Bash',
    allowLinkedProviders: false,
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

export const generateResourceTypeSchema = (resourceTypes = []) => {
  // Ideally instead of blacklisting use properties.abstract, however it is always true.
  const list = resourceTypes
    .filter(r => r.name !== blacklistAbstracts.find(bl => bl === r.name))
    .map(r => ({
      id: r.id,
      displayName: r.name.replace('Gestalt::Configuration::Provider::', ''),
      name: r.name,
      type: r.name,
      allowLinkedProviders: false,
      allowEnvVariables: true,
      ...uiProviderTypes.find(i => i.name === r.name)
    }));

  return orderBy(list, 'displayName');
};
