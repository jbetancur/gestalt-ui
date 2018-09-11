export const PREFIX = 'metaResource/';

/**
 * Environments
 */
export const UNLOAD_ENVIRONMENT = `${PREFIX}UNLOAD_ENVIRONMENT`;

/**
 * Orgs
 */
export const FETCH_ALLORGS_REQUEST = `${PREFIX}FETCH_ALLORGS_REQUEST`;
export const FETCH_ALLORGS_FULFILLED = `${PREFIX}FETCH_ALLORGS_FULFILLED`;
export const FETCH_ALLORGS_REJECTED = `${PREFIX}FETCH_ALLORGS_REJECTED`;

export const FETCH_ALLORGSDROPDOWN_REQUEST = `${PREFIX}FETCH_ALLORGSDROPDOWN_REQUEST`;
export const FETCH_ALLORGSDROPDOWN_FULFILLED = `${PREFIX}FETCH_ALLORGSDROPDOWN_FULFILLED`;
export const FETCH_ALLORGSDROPDOWN_REJECTED = `${PREFIX}FETCH_ALLORGSDROPDOWN_REJECTED`;

export const FETCH_ORGSET_REQUEST = `${PREFIX}FETCH_ORGSET_REQUEST`;
export const FETCH_ORGSET_FULFILLED = `${PREFIX}FETCH_ORGSET_FULFILLED`;
export const FETCH_ORGSET_REJECTED = `${PREFIX}FETCH_ORGSET_REJECTED`;

/**
 * Self
 */
export const FETCH_SELF_REQUEST = `${PREFIX}FETCH_SELF_REQUEST`;
export const FETCH_SELF_FULFILLED = `${PREFIX}FETCH_SELF_FULFILLED`;
export const FETCH_SELF_REJECTED = `${PREFIX}FETCH_SELF_REJECTED`;

/**
 * Lambdas
 */
export const FETCH_LAMBDAS_REQUEST = `${PREFIX}FETCH_LAMBDAS_REQUEST`;
export const FETCH_LAMBDAS_FULFILLED = `${PREFIX}FETCH_LAMBDAS_FULFILLED`;
export const FETCH_LAMBDAS_REJECTED = `${PREFIX}FETCH_LAMBDAS_REJECTED`;
export const FETCH_LAMBDAS_CANCELLED = `${PREFIX}FETCH_LAMBDAS_CANCELLED`;

export const FETCH_LAMBDA_REQUEST = `${PREFIX}FETCH_LAMBDA_REQUEST`;
export const FETCH_LAMBDA_FULFILLED = `${PREFIX}FETCH_LAMBDA_FULFILLED`;
export const FETCH_LAMBDA_REJECTED = `${PREFIX}FETCH_LAMBDA_REJECTED`;

export const CREATE_LAMBDA_REQUEST = `${PREFIX}CREATE_LAMBDA_REQUEST`;
export const CREATE_LAMBDA_FULFILLED = `${PREFIX}CREATE_LAMBDA_FULFILLED`;
export const CREATE_LAMBDA_REJECTED = `${PREFIX}CREATE_LAMBDA_REJECTED`;

export const UPDATE_LAMBDA_REQUEST = `${PREFIX}UPDATE_LAMBDA_REQUEST`;
export const UPDATE_LAMBDA_FULFILLED = `${PREFIX}UPDATE_LAMBDA_FULFILLED`;
export const UPDATE_LAMBDA_REJECTED = `${PREFIX}UPDATE_LAMBDA_REJECTED`;

export const DELETE_LAMBDAS_REQUEST = `${PREFIX}DELETE_LAMBDAS_REQUEST`;
export const DELETE_LAMBDA_REQUEST = `${PREFIX}DELETE_LAMBDA_REQUEST`;
export const DELETE_LAMBDA_FULFILLED = `${PREFIX}DELETE_LAMBDA_FULFILLED`;
export const DELETE_LAMBDA_REJECTED = `${PREFIX}DELETE_LAMBDA_REJECTED`;

/**
 * Containers
 */
export const FETCH_CONTAINERS_REQUEST = `${PREFIX}FETCH_CONTAINERS_REQUEST`;
export const FETCH_CONTAINERS_FULFILLED = `${PREFIX}FETCH_CONTAINERS_FULFILLED`;
export const FETCH_CONTAINERS_REJECTED = `${PREFIX}FETCH_CONTAINERS_REJECTED`;
export const FETCH_CONTAINERS_CANCELLED = `${PREFIX}FETCH_CONTAINERS_CANCELLED`;

export const FETCH_CONTAINER_REQUEST = `${PREFIX}FETCH_CONTAINER_REQUEST`;
export const FETCH_CONTAINER_FULFILLED = `${PREFIX}FETCH_CONTAINER_FULFILLED`;
export const FETCH_CONTAINER_REJECTED = `${PREFIX}FETCH_CONTAINER_REJECTED`;
export const FETCH_CONTAINER_CANCELLED = `${PREFIX}FETCH_CONTAINER_CANCELLED`;

export const FETCH_PROVIDERCONTAINER_REQUEST = `${PREFIX}FETCH_PROVIDERCONTAINER_REQUEST`;
export const CREATE_CONTAINER_REQUEST = `${PREFIX}CREATE_CONTAINER_REQUEST`;
export const CREATE_CONTAINER_FULFILLED = `${PREFIX}CREATE_CONTAINER_FULFILLED`;
export const CREATE_CONTAINER_REJECTED = `${PREFIX}CREATE_CONTAINER_REJECTED`;

export const UPDATE_CONTAINER_REQUEST = `${PREFIX}UPDATE_CONTAINER_REQUEST`;
export const UPDATE_CONTAINER_FULFILLED = `${PREFIX}UPDATE_CONTAINER_FULFILLED`;
export const UPDATE_CONTAINER_REJECTED = `${PREFIX}UPDATE_CONTAINER_REJECTED`;

export const DELETE_CONTAINER_REQUEST = `${PREFIX}DELETE_CONTAINER_REQUEST`;
export const DELETE_CONTAINER_FULFILLED = `${PREFIX}DELETE_CONTAINER_FULFILLED`;
export const DELETE_CONTAINER_REJECTED = `${PREFIX}DELETE_CONTAINER_REJECTED`;

export const SCALE_CONTAINER_REQUEST = `${PREFIX}SCALE_CONTAINER_REQUEST`;
export const SCALE_CONTAINER_FULFILLED = `${PREFIX}SCALE_CONTAINER_FULFILLED`;
export const SCALE_CONTAINER_REJECTED = `${PREFIX}SCALE_CONTAINER_REJECTED`;

export const MIGRATE_CONTAINER_REQUEST = `${PREFIX}MIGRATE_CONTAINER_REQUEST`;
export const MIGRATE_CONTAINER_FULFILLED = `${PREFIX}MIGRATE_CONTAINER_FULFILLED`;
export const MIGRATE_CONTAINER_REJECTED = `${PREFIX}MIGRATE_CONTAINER_REJECTED`;

export const PROMOTE_CONTAINER_REQUEST = `${PREFIX}PROMOTE_CONTAINER_REQUEST`;
export const PROMOTE_CONTAINER_FULFILLED = `${PREFIX}PROMOTE_CONTAINER_FULFILLED`;
export const PROMOTE_CONTAINER_REJECTED = `${PREFIX}PROMOTE_CONTAINER_REJECTED`;

export const FETCH_CONTAINERS_DROPDOWN_REQUEST = `${PREFIX}FETCH_CONTAINERS_DROPDOWN_REQUEST`;
export const FETCH_CONTAINERS_DROPDOWN_FULFILLED = `${PREFIX}FETCH_CONTAINERS_DROPDOWN_FULFILLED`;
export const FETCH_CONTAINERS_DROPDOWN_REJECTED = `${PREFIX}FETCH_CONTAINERS_DROPDOWN_REJECTED`;

export const UNLOAD_CONTAINER = `${PREFIX}UNLOAD_CONTAINER`;
export const UNLOAD_CONTAINERS = `${PREFIX}UNLOAD_CONTAINERS`;

/**
 * Entitlements
 */
export const FETCH_ENTITLEMENTS_REQUEST = `${PREFIX}FETCH_ENTITLEMENTS_REQUEST`;
export const FETCH_ENTITLEMENTS_FULFILLED = `${PREFIX}FETCH_ENTITLEMENTS_FULFILLED`;
export const FETCH_ENTITLEMENTS_REJECTED = `${PREFIX}FETCH_ENTITLEMENTS_REJECTED`;

export const UPDATE_ENTITLEMENT_REQUEST = `${PREFIX}UPDATE_ENTITLEMENT_REQUEST`;
export const UPDATE_ENTITLEMENT_FULFILLED = `${PREFIX}UPDATE_ENTITLEMENT_FULFILLED`;
export const UPDATE_ENTITLEMENT_REJECTED = `${PREFIX}UPDATE_ENTITLEMENT_REJECTED`;

export const UNLOAD_ENTITLEMENTS = `${PREFIX}UNLOAD_ENTITLEMENTS`;

/**
 * Groups
 */
export const ADD_GROUPMEMBER_REQUEST = `${PREFIX}ADD_GROUPMEMBER_REQUEST`;
export const ADD_GROUPMEMBER_FULFILLED = `${PREFIX}ADD_GROUPMEMBER_FULFILLED`;
export const ADD_GROUPMEMBER_REJECTED = `${PREFIX}ADD_GROUPMEMBER_REJECTED`;
export const REMOVE_GROUPMEMBER_REQUEST = `${PREFIX}REMOVE_GROUPMEMBER_REQUEST`;
export const REMOVE_GROUPMEMBER_FULFILLED = `${PREFIX}REMOVE_GROUPMEMBER_FULFILLED`;
export const REMOVE_GROUPMEMBER_REJECTED = `${PREFIX}REMOVE_GROUPMEMBER_REJECTED`;

/**
 * Logs
 */
export const FETCH_LOGPROVIDER_REQUEST = `${PREFIX}FETCH_LOGPROVIDER_REQUEST`;
export const FETCH_LOGPROVIDER_FULFILLED = `${PREFIX}FETCH_LOGPROVIDER_FULFILLED`;
export const FETCH_LOGPROVIDER_REJECTED = `${PREFIX}FETCH_LOGPROVIDER_REJECTED`;
export const UNLOAD_LOGPROVIDER = `${PREFIX}UNLOAD_LOGPROVIDER`;

/**
 * Search
 */
export const DO_SEARCHUSERS_REQUEST = `${PREFIX}DO_SEARCHUSERS_REQUEST`;
export const DO_SEARCHUSERS_FULFILLED = `${PREFIX}DO_SEARCHUSERS_FULFILLED`;
export const DO_SEARCHUSERS_REJECTED = `${PREFIX}DO_SEARCHUSERS_REJECTED`;
export const DO_SEARCHASSETS_REQUEST = `${PREFIX}DO_SEARCHASSETS_REQUEST`;
export const DO_SEARCHASSETS_FULFILLED = `${PREFIX}DO_SEARCHASSETS_FULFILLED`;
export const DO_SEARCHASSETS_REJECTED = `${PREFIX}DO_SEARCHASSETS_REJECTED`;

export const UNLOAD_SEARCHASSETS = `${PREFIX}UNLOAD_SEARCHASSETS`;
export const UNLOAD_SEARCHUSERS = `${PREFIX}UNLOAD_SEARCHUSERS`;

/**
 * Type Properties
 */
export const CREATE_TYPEPROPERTY_REQUEST = `${PREFIX}CREATE_TYPEPROPERTY_REQUEST`;
export const CREATE_TYPEPROPERTY_FULFILLED = `${PREFIX}CREATE_TYPEPROPERTY_FULFILLED`;
export const CREATE_TYPEPROPERTY_REJECTED = `${PREFIX}CREATE_TYPEPROPERTY_REJECTED`;
export const UPDATE_TYPEPROPERTY_REQUEST = `${PREFIX}UPDATE_TYPEPROPERTY_REQUEST`;
export const UPDATE_TYPEPROPERTY_FULFILLED = `${PREFIX}UPDATE_TYPEPROPERTY_FULFILLED`;
export const UPDATE_TYPEPROPERTY_REJECTED = `${PREFIX}UPDATE_TYPEPROPERTY_REJECTED`;
export const DELETE_TYPEPROPERTY_REQUEST = `${PREFIX}DELETE_TYPEPROPERTY_REQUEST`;
export const DELETE_TYPEPROPERTY_FULFILLED = `${PREFIX}DELETE_TYPEPROPERTY_FULFILLED`;
export const DELETE_TYPEPROPERTY_REJECTED = `${PREFIX}DELETE_TYPEPROPERTY_REJECTED`;
export const BATCH_UPDATE_TYPEPROPERTY_REQUEST = `${PREFIX}BATCH_UPDATE_TYPEPROPERTY_REQUEST`;
export const BATCH_UPDATE_TYPEPROPERTY_FULFILLED = `${PREFIX}BATCH_UPDATE_TYPEPROPERTY_FULFILLED`;
export const BATCH_UPDATE_TYPEPROPERTY_REJECTED = `${PREFIX}BATCH_UPDATE_TYPEPROPERTY_REJECTED`;

/**
 * Providers
 */
export const REDEPLOY_PROVIDER_REQUEST = `${PREFIX}REDEPLOY_PROVIDER_REQUEST`;
export const REDEPLOY_PROVIDER_FULFILLED = `${PREFIX}REDEPLOY_PROVIDER_FULFILLED`;
export const REDEPLOY_PROVIDER_REJECTED = `${PREFIX}REDEPLOY_PROVIDER_REJECTED`;

/**
 * Env
 */
export const FETCH_ENV_REQUEST = `${PREFIX}FETCH_ENV_REQUEST`;
export const FETCH_ENV_FULFILLED = `${PREFIX}FETCH_ENV_FULFILLED`;
export const FETCH_ENV_REJECTED = `${PREFIX}FETCH_ENV_REJECTED`;

export const FETCH_ENVSCHEMA_REQUEST = `${PREFIX}FETCH_ENVSCHEMA_REQUEST`;
export const FETCH_ENVSCHEMA_FULFILLED = `${PREFIX}FETCH_ENVSCHEMA_FULFILLED`;
export const FETCH_ENVSCHEMA_REJECTED = `${PREFIX}FETCH_ENVSCHEMA_REJECTED`;

export const UNLOAD_ENVSCHEMA = `${PREFIX}UNLOAD_ENVSCHEMA`;
