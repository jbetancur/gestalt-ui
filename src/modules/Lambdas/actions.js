import axios from 'axios';
import { push, replace } from 'react-router-redux';
import {
  FETCH_LAMBDAS_PENDING,
  FETCH_LAMBDAS_REJECTED,
  FETCH_LAMBDAS_FULFILLED,
  FETCH_LAMBDA_PENDING,
  FETCH_LAMBDA_FULFILLED,
  FETCH_LAMBDA_REJECTED,
  CREATE_LAMBDA_PENDING,
  CREATE_LAMBDA_FULFILLED,
  CREATE_LAMBDA_REJECTED,
  UPDATE_LAMBDA_PENDING,
  UPDATE_LAMBDA_FULFILLED,
  UPDATE_LAMBDA_REJECTED,
  DELETE_LAMBDA_PENDING,
  DELETE_LAMBDA_REJECTED
} from './actionTypes';

export function fetchLambdas(fqon, environmentId) {
  const url = environmentId ? `/${fqon}/environments/${environmentId}/lambdas` : `/${fqon}/lambdas`;

  return (dispatch) => {
    dispatch({ type: FETCH_LAMBDAS_PENDING });
    axios.get(`${url}?expand=true`).then((response) => {
      dispatch({ type: FETCH_LAMBDAS_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_LAMBDAS_REJECTED, payload: err });
    });
  };
}

export function fetchLambda(fqon, lambdaId) {
  return (dispatch) => {
    dispatch({ type: FETCH_LAMBDA_PENDING });
    axios.get(`${fqon}/lambda/${lambdaId}`).then((response) => {
      dispatch({ type: FETCH_LAMBDA_FULFILLED, payload: response.data });
    }).catch((err) => {
      dispatch({ type: FETCH_LAMBDA_REJECTED, payload: err });
    });
  };
}

export function createLambda(fqon, environmentId, payload) {
  return (dispatch) => {
    dispatch({ type: CREATE_LAMBDA_PENDING });
    axios.post(`${fqon}/${environmentId}/lambdas`, payload).then((response) => {
      dispatch({ type: CREATE_LAMBDA_FULFILLED, payload: response.data });
      dispatch(push(`${fqon}/lambdas`));
    }).catch((err) => {
      dispatch({ type: CREATE_LAMBDA_REJECTED, payload: err });
    });
  };
}

export function updateLambda(fqon, lambdaId, patches) {
  return (dispatch) => {
    dispatch({ type: UPDATE_LAMBDA_PENDING });
    axios.patch(`${fqon}/lambdas/${lambdaId}`, patches).then((response) => {
      dispatch({ type: UPDATE_LAMBDA_FULFILLED, payload: response.data });
      dispatch(push(`${fqon}/lambdas`));
    }).catch((err) => {
      dispatch({ type: UPDATE_LAMBDA_REJECTED, payload: err });
    });
  };
}

export function deleteLambda(fqon, lambdaId) {
  return (dispatch) => {
    dispatch({ type: DELETE_LAMBDA_PENDING });
    axios.delete(`${fqon}/lambdas/${lambdaId}?force=true`).then(() => {
      dispatch(replace(`${fqon}/lambdas`));
    }).catch((err) => {
      dispatch({ type: DELETE_LAMBDA_REJECTED, payload: err });
    });
  };
}

export default { fetchLambdas, fetchLambda, createLambda, updateLambda, deleteLambda };
