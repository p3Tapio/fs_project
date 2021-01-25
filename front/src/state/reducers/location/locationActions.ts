/* eslint-disable no-console */

import { Dispatch } from 'redux';
import axios from 'axios';
import {
  LocationDispatchTypes, GETLOCATIONS, NewLocation, CREATELOCATION, GETUSERLOCATIONS, DELETELOCATION, CLEARUSERDATA,
} from './locationTypes';
import { createConfig } from '../../localStore';

const baseUrl = process.env.REACT_APP_URL;

export const getAllLocations = () => async (dispatch: Dispatch<LocationDispatchTypes>): Promise<void> => {
  const res = await axios.get(`${baseUrl}/api/location/all`);
  const { data } = res;
  dispatch({
    type: GETLOCATIONS,
    payload: data,
  });
};
export const getUserLocations = () => async (dispatch: Dispatch<LocationDispatchTypes>): Promise<void> => {
  const config = createConfig();
  if (config.headers.token) {
    const res = await axios.get(`${baseUrl}/api/location/user`, config);
    const { data } = res;
    dispatch({
      type: GETUSERLOCATIONS,
      payload: data,
    });
  }
};
export const createNewLocation = (location: NewLocation) => async (dispatch: Dispatch<LocationDispatchTypes>): Promise<void> => {
  const config = createConfig();
  if (config.headers.token) {
    const res = await axios.post(`${baseUrl}/api/location/create`, location, config);
    const { data } = res;
    dispatch({
      type: CREATELOCATION,
      payload: data,
    });
  }
};
export const deleteLocation = (id: string) => async (dispatch: Dispatch<LocationDispatchTypes>): Promise<void> => {
  const config = createConfig();
  if (config.headers.token) {
    await axios.delete(`${baseUrl}/api/location/delete/${id}`, config);
    dispatch({
      type: DELETELOCATION,
      payload: id,
    });
  }
};
export const logoutUser = () => (dispatch: Dispatch<LocationDispatchTypes>): void => {
  window.localStorage.clear();
  dispatch({ type: CLEARUSERDATA });
};