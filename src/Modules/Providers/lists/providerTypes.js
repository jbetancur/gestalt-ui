import { orderBy } from 'lodash';
import providerModel from '../models/provider';
import dcosModel from '../models/dcos';
import kubernetesModel from '../models/kubernetes';
import ecsModel from '../models/ecs';
import dockerModel from '../models/docker';
import laserModel from '../models/laser';
import executorModel from '../models/executor';

export const uiProviderTypes = [
  // Caas
  {
    name: 'Gestalt::Configuration::Provider::CaaS::DCOS',
    model: dcosModel,
    DCOSConfig: true,
    allowEnvVariables: false,
    networksConfig: true,
    allowLinkedProviders: true,
    showGPUOption: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::CaaS::Kubernetes',
    model: kubernetesModel,
    dataConfig: true,
    allowEnvVariables: false,
    allowStorageClasses: true,
    inputType: 'yaml',
    subTypes: ['Default', 'GKE', 'EKS'],
    allowLinkedProviders: true,
    showGPUOption: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::CaaS::ECS',
    model: ecsModel,
    ecsConfig: true,
    allowEnvVariables: false,
    allowStorageClasses: true,
    inputType: 'json',
    subTypes: ['Fargate', 'EC2'],
    networksConfig: true,
    allowLinkedProviders: true,
    showGPUOption: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::CaaS::Docker',
    model: dockerModel,
    allowEnvVariables: false,
    allowLinkedProviders: true,
    showGPUOption: true,
  },

  // Executors
  {
    name: 'Gestalt::Configuration::Provider::Lambda::Executor::NodeJS',
    model: executorModel,
    allowLinkedProviders: false,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda::Executor::Nashorn',
    model: executorModel,
    allowLinkedProviders: false,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda::Executor::Scala',
    model: executorModel,
    allowLinkedProviders: false,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda::Executor::Java',
    model: executorModel,
    allowLinkedProviders: false,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda::Executor::Ruby',
    model: executorModel,
    allowLinkedProviders: false,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda::Executor::Python',
    model: executorModel,
    allowLinkedProviders: false,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda::Executor::CSharp',
    model: executorModel,
    allowLinkedProviders: false,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda::Executor::GoLang',
    model: executorModel,
    allowLinkedProviders: false,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda::Executor::Bash',
    model: executorModel,
    allowLinkedProviders: false,
  },

  // Generic Providers
  // Gateways/API
  {
    name: 'Gestalt::Configuration::Provider::GatewayManager::AWS',
    model: providerModel,
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::GatewayManager',
    model: providerModel,
    allowLinkedProviders: true,
    showContainerOption: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Kong',
    model: providerModel,
    allowLinkedProviders: true,
    showContainerOption: true,
  },
  // Lambda
  {
    name: 'Gestalt::Configuration::Provider::Lambda',
    model: laserModel,
    allowLinkedProviders: true,
    showContainerOption: true,
    showGPUOption: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Lambda::AWS',
    model: providerModel,
    allowLinkedProviders: true,
    showContainerOption: true,
  },

  {
    name: 'Gestalt::Configuration::Provider::Security',
    model: providerModel,
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Data::PostgreSQL',
    model: providerModel,
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Messaging::RabbitMQ',
    model: providerModel,
    allowLinkedProviders: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Policy',
    model: providerModel,
    allowLinkedProviders: true,
    showContainerOption: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::Logging',
    model: providerModel,
    allowLinkedProviders: true,
    showContainerOption: true,
  },
  {
    name: 'Gestalt::Configuration::Provider::GestaltFlink',
    model: providerModel,
    allowLinkedProviders: true,
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
  // Ideally instead of blacklisting we could use properties.abstract, however it is always true :(
  const list = resourceTypes
    .filter(r => r.name !== blacklistAbstracts.find(bl => bl === r.name))
    .map(r => ({
      id: r.id,
      displayName: r.name.replace('Gestalt::Configuration::Provider::', ''),
      name: r.name,
      model: providerModel,
      type: r.name,
      allowLinkedProviders: false,
      allowEnvVariables: true,
      ...uiProviderTypes.find(i => i.name === r.name)
    }));

  return orderBy(list, 'displayName');
};
