import { orderBy } from 'lodash';

const uiProviderTypes = [
  {
    name: 'Gestalt::Configuration::Provider::CaaS::DCOS',
    DCOSConfig: true,
    allowEnvVariables: false,
    networksConfig: true,
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::CaaS::Kubernetes',
    dataConfig: true,
    allowEnvVariables: false,
    allowStorageClasses: true,
    inputType: 'yaml',
    subTypes: ['Default', 'GKE', 'EKS'],
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::CaaS::ECS',
    ecsConfig: true,
    allowEnvVariables: false,
    allowStorageClasses: true,
    inputType: 'json',
    subTypes: ['Fargate', 'EC2'],
    networksConfig: true,
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::CaaS::Docker',
    allowEnvVariables: false,
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Kong',
    allowContainer: true,
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::GatewayManager',
    allowContainer: true,
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Security',
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Data::PostgreSQL',
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Messaging::RabbitMQ',
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Policy',
    allowContainer: true,
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Logging',
    allowContainer: true,
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::GestaltFlink',
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
