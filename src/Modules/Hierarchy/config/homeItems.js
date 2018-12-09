
// import { DOCUMENTATION_URL } from '../../../constants';

// eslint-disable-next-line no-unused-vars
export default (baseUrl, experimentalFlag) => ([
  {
    key: 'apis-home-card',
    title: 'APIs',
    description: 'Upstream access to Lambdas/Containers can be defined through API endpoints',
    icon: 'api',
    iconColor: 'blue-grey',
    iconGradient: '500',
    manageURL: `${baseUrl}/apis`,
    createURL: `${baseUrl}/apis/create`
  },
  {
    key: 'containers-home-card',
    title: 'Containers',
    description: 'Create, manage and migrate Containers across Kubernetes, Swarm or DCOS',
    icon: 'container',
    iconColor: 'blue',
    iconGradient: '700',
    manageURL: `${baseUrl}/containers`,
    createURL: `${baseUrl}/containers/create`
  },
  {
    key: 'lambdas-home-card',
    title: 'Lambdas',
    description: 'Create, manage and deploy Lambdas with support for a wide array of languages',
    icon: 'lambda',
    iconColor: 'amber',
    iconGradient: '500',
    manageURL: `${baseUrl}/lambdas`,
    createURL: `${baseUrl}/lambdas/create`
  },
  {
    key: 'streamspecs-home-card',
    title: 'Streams',
    description: 'Transform Data Streams using a Lambda',
    icon: 'stream',
    iconColor: 'light-blue',
    iconGradient: '500',
    manageURL: `${baseUrl}/streamspecs`,
    createURL: `${baseUrl}/streamspecs/create`
  },
  {
    key: 'policies-home-card',
    title: 'Policies',
    description: 'Keep infrastucture under control and/or leverage events that trigger custom actions',
    icon: 'policy',
    iconColor: 'green',
    iconGradient: '500',
    manageURL: `${baseUrl}/policies`,
    createURL: `${baseUrl}/policies/create`
  },
  {
    key: 'volumes-home-card',
    title: 'Volumes',
    description: 'Manage Container Storage Volumes',
    icon: 'policy',
    iconColor: 'teal',
    iconGradient: '500',
    manageURL: `${baseUrl}/volumes`,
    createURL: `${baseUrl}/volumes/create`
  },
  {
    key: 'secrets-home-card',
    title: 'Secrets',
    description: 'Secret are intended to hold sensitive information: passwords, OAuth tokens, and ssh keys',
    icon: 'secret',
    iconColor: 'indigo',
    iconGradient: '500',
    manageURL: `${baseUrl}/secrets`,
    createURL: `${baseUrl}/secrets/create`
  },
  {
    key: 'datafeeds-home-card',
    title: 'Data Feeds',
    description: 'Real-time Data Feeds',
    icon: 'datafeed',
    iconColor: 'pink',
    iconGradient: '300',
    manageURL: `${baseUrl}/datafeeds`,
    createURL: `${baseUrl}/datafeeds/create`
  },
  {
    key: 'appdeployments-home-card',
    title: 'Application Deployments',
    description: 'Create and Manage Kubernetes Application Deployments (BETA)',
    icon: 'appDeployment',
    iconColor: 'blue',
    iconGradient: '900',
    manageURL: `${baseUrl}/appdeployments`,
    createURL: `${baseUrl}/appdeployments/create`
  },
]);
