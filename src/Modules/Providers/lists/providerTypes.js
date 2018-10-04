import { orderBy } from 'lodash';

const uiProviderTypes = [
  {
    name: 'Gestalt::Configuration::Provider::CaaS::DCOS',
    DCOSConfig: true,
    yamlDataConfig: false,
    allowContainer: false,
    allowLinkedProviders: true,
    allowEnvVariables: false,
  },
  {
    name: 'Gestalt::Configuration::Provider::CaaS::Kubernetes',
    yamlDataConfig: true,
    allowContainer: false,
    allowLinkedProviders: true,
    allowEnvVariables: false,
    inputType: 'yaml',
    allowStorageClasses: true,
    subTypes: ['Default', 'GKE', 'EKS'],
  },
  {
    name: 'Gestalt::Configuration::Provider::CaaS::ECS',
    yamlDataConfig: true,
    allowContainer: false,
    allowLinkedProviders: true,
    allowEnvVariables: false,
    inputType: 'json',
    subTypes: ['Fargate', 'EC2'],
  },
  {
    name: 'Gestalt::Configuration::Provider::CaaS::Docker',
    yamlDataConfig: false,
    allowContainer: false,
    allowLinkedProviders: true,
    allowEnvVariables: false,
  },
  {
    name: 'Gestalt::Configuration::Provider::Kong',
    yamlDataConfig: false,
    allowContainer: true,
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::GatewayManager',
    yamlDataConfig: false,
    allowContainer: true,
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Security',
    yamlDataConfig: false,
    allowContainer: false,
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Data::PostgreSQL',
    yamlDataConfig: false,
    allowContainer: false,
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Messaging::RabbitMQ',
    yamlDataConfig: false,
    allowContainer: false,
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Policy',
    yamlDataConfig: false,
    allowContainer: true,
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Logging',
    yamlDataConfig: false,
    allowContainer: true,
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::GestaltFlink',
    yamlDataConfig: false,
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
