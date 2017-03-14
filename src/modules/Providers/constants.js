// Key names should match the providerTypes list value

export const KONG = '25acb32c-6635-49d1-ba19-4cf317003ff6';
export const GATEWAYMANAGER = 'a695c8ca-b429-4127-80bb-688583880257';
export const KUBERNETES = '79075694-6510-49d3-8bd5-a8dce581bd48';
export const DCOS = '26a2694e-ddc7-4a34-a910-f794cc2417e4';
export const SECURITY = '26a2694e-ddc7-4a34-a910-f794cc2417e4'; // TODO: Value
export const DATABASE_POSTGRESQL = '26a2694e-ddc7-4a34-a910-f794cc2417e4'; // TODO: Value
export const LAMBDA = '26a2694e-ddc7-4a34-a910-f794cc2417e4'; // TODO: Value
export const LAMBDA_NODEJS = '26a2694e-ddc7-4a34-a910-f794cc2417e4'; // TODO: Value
export const LAMBDA_SCALA = '26a2694e-ddc7-4a34-a910-f794cc2417e4'; // TODO: Value
export const LAMBDA_JAVA = '26a2694e-ddc7-4a34-a910-f794cc2417e4'; // TODO: Value
export const LAMBDA_RUBY = '26a2694e-ddc7-4a34-a910-f794cc2417e4'; // TODO: Value
export const LAMBDA_PYTHON = '26a2694e-ddc7-4a34-a910-f794cc2417e4'; // TODO: Value
export const LAMBDA_CSHARP = '26a2694e-ddc7-4a34-a910-f794cc2417e4'; // TODO: Value
export const LAMBDA_GO = '26a2694e-ddc7-4a34-a910-f794cc2417e4'; // TODO: Value

export default {
  KONG,
  GATEWAYMANAGER,
  KUBERNETES,
  DCOS,
  SECURITY,
  'DATABASE::POSTGRESQL': DATABASE_POSTGRESQL,
  LAMBDA,
  'LAMBDA::NODEJS': LAMBDA_NODEJS,
  'LAMBDA::SCALA': LAMBDA_SCALA,
  'LAMBDA::JAVA': LAMBDA_JAVA,
  'LAMBDA::RUBY': LAMBDA_RUBY,
  'LAMBDA::PYTHON': LAMBDA_PYTHON,
  'LAMBDA::CSHARP': LAMBDA_CSHARP,
  'LAMBDA::GO': LAMBDA_GO,
};
