export default[
  {
    name: 'Marathon',
    value: 'Gestalt::Configuration::Provider::Marathon',
    type: 'container',
    auth: true,
    networking: true,
    extraConfig: true,
  },
  {
    name: 'Compute::Container::Kubernetes',
    value: 'Gestalt::Configuration::Provider::CaaS',
    type: 'Container',
    auth: false,
    networking: false,
    extraConfig: false,
  },
  {
    name: 'Kong',
    value: 'Gestalt::Configuration::Provider::ApiGateway',
    type: 'apigateway',
    auth: true,
    networking: false,
    extraConfig: true,
  },
];
