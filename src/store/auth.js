import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegun } from "./api";
import httpService from "../utils/httpService";

const slice = createSlice({
  name: "auth",
  initialState: {
    access: localStorage.getItem("access"),
    refresh: localStorage.getItem("refresh"),
    isAuthenticated: false,
    user: {},
    loading: false,
    error: null,
  },
  reducers: {
    authStarted: (auth, action) => {
      auth.loading = true;
    },

    authSuccess: (auth, action) => {
      localStorage.setItem("access", action.payload.access);
      localStorage.setItem("refresh", action.payload.refresh);

      auth.isAuthenticated = true;
      auth.access = action.payload.access;
      auth.refresh = action.payload.refresh;
      auth.loading = false;
      auth.error = null;
    },

    userSignedUp: (auth, action) => {
      auth.isAuthenticated = false;
    },

    userLoaded: (auth, action) => {
      auth.user = action.payload;
      auth.loading = false;
    },

    userLoadingFailed: (auth, action) => {
      auth.user = {};
      auth.loading = false;
    },

    authFailed: (auth, action) => {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      auth.isAuthenticated = false;
      auth.access = null;
      auth.refresh = null;
      auth.error = action.payload;
      auth.loading = false;
    },

    authenticationVerified: (auth, action) => {
      auth.isAuthenticated = true;
    },

    authenticationFailed: (auth, action) => {
      auth.isAuthenticated = false;
    },

    loggedOut: (auth, action) => {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      auth.isAuthenticated = false;
      auth.access = null;
      auth.refresh = null;
      auth.user = {};

      auth.error = null;
    },
  },
});

const {
  authStarted,
  authSuccess,
  userSignedUp,
  userLoaded,
  userLoadingFailed,
  authFailed,
  authenticationVerified,
  authenticationFailed,
  loggedOut,
} = slice.actions;
export default slice.reducer;

export const checkAuthenticated = () => async (dispatch) => {
  const access = localStorage.getItem("access");

  if (access) {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const data = { token: access };

    try {
      const response = await httpService.post(
        "http://127.0.0.1:8000/api/auth/jwt/verify/",
        data,
        headers
      );

      if (response.data.code !== "token_not_valid") {
        await dispatch(authenticationVerified());
      }
    } catch (error) {
      dispatch(authenticationFailed());
    }
  } else {
    dispatch(authenticationFailed());
  }
};

export const loadUser = () => (dispatch) => {
  const access = localStorage.getItem("access");

  if (access) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
      Accept: "application/json",
    };

    dispatch(
      apiCallBegun({
        url: "http://127.0.0.1:8000/api/auth/users/me/",
        method: "GET",
        headers,
        onStart: authStarted.type,
        onSuccess: userLoaded.type,
        onError: userLoadingFailed.type,
      })
    );
  } else {
    dispatch(userLoadingFailed());
  }
};

export const login = (email, password) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
  };

  const body = { email, password };

  await dispatch(
    apiCallBegun({
      url: "http://127.0.0.1:8000/api/auth/jwt/create/",
      method: "POST",
      data: body,
      headers,
      onStart: authStarted.type,
      onSuccess: authSuccess.type,
      onError: authFailed.type,
    })
  );

  dispatch(loadUser());
};

export const signup =
  (gender, cnic, isTailor, image, phone, first_name, last_name, email, password, re_password) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
    };

    const body = { gender, cnic, isTailor, image, phone, first_name, last_name, email, password, re_password };

    await dispatch(
      apiCallBegun({
        url: "http://127.0.0.1:8000/api/auth/users/",
        method: "POST",
        data: JSON.stringify(body),
        headers,
        onStart: authStarted.type,
        onSuccess: userSignedUp.type,
        onError: authFailed.type,
      })
    );
  };

export const verify = (uid, token) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
  };

  const body = { uid, token };

  try {
    await httpService.post("http://127.0.0.1:8000/api/auth/users/activation/", body, headers);
    dispatch({ type: "ACTIVATION_SUCCESS" });
  } catch (error) {
    dispatch({ type: "ACTIVATION_FAILED" });
  }
};

export const reset_password = (email) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
  };

  const body = { email };

  try {
    await httpService.post("http://127.0.0.1:8000/api/auth/users/reset_password/", body, headers);
    dispatch({ type: "RESET_PASSWORD_SUCCESS" });
  } catch (error) {
    dispatch({ type: "RESET_PASSWORD_FAILED" });
  }
};

export const reset_password_confirm =
  (uid, token, new_password, re_new_password) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
    };

    const body = { uid, token, new_password, re_new_password };

    try {
      await httpService.post(
        "http://127.0.0.1:8000/api/auth/users/reset_password_confirm/",
        body,
        headers
      );
      dispatch({ type: "RESET_PASSWORD_CONFIRM_SUCCESS" });
    } catch (error) {
      dispatch({ type: "RESET_PASSWORD_CONFIRM_FAILED" });
    }
  };

export const logout = () => (dispatch) => {
  dispatch({ type: loggedOut.type });
};
