export default[
  {
    name: 'Marathon',
    value: 'Gestalt::Configuration::Provider::Marathon',
    type: 'container'
  },
  {
    name: 'Kong',
    value: 'Gestalt::Configuration::Provider::ApiGateway',
    type: 'apigateway'
  },
  {
    name: 'Lambda',
    value: 'Gestalt::Configuration::Provider::Lambda',
    type: 'lambda'
  }
];
