import { TResponse } from "../data/AppInterface";
import { Response } from "express";
import { BAD_REQUEST_CODE, DEFAULT_STATUS_CODE_ERROR, DEFAULT_STATUS_CODE_SUCCESS, UNAUTHORIZED_ACCESS_CODE,NOT_FOUND_CODE, DEFAULT_STATUS_SUCCESS, DEFAULT_STATUS_ERROR, DUPLICATE_CONFLICT_CODE } from "./app-message";

export const resSuccess: TResponse = (payload) => {
  return {
    code: payload?.code || DEFAULT_STATUS_CODE_SUCCESS,
    status: payload?.status || DEFAULT_STATUS_SUCCESS,
    message: payload.message ,
    data: payload?.data || null,
  };
};

export const resUnauthorizedAccess: TResponse = (payload) => {
  return {
    code: payload?.code || UNAUTHORIZED_ACCESS_CODE,
    status: payload?.status || DEFAULT_STATUS_ERROR,
    message: payload.message ,
    data: payload?.data || null,
  };
};

export const resUnknownError: TResponse = (payload) => {
  return {
    code: payload?.code || DEFAULT_STATUS_CODE_ERROR,
    status: payload?.status || DEFAULT_STATUS_ERROR,
    message: payload.message,
    data: payload?.data || null,
  };
};

export const resBadRequest: TResponse = (payload) => {
  return {
    code: payload?.code || BAD_REQUEST_CODE,
    status: payload?.status || DEFAULT_STATUS_ERROR,
    message: payload.message,
    data: payload?.data || null,
  };
};
export const resDuplicateConflict: TResponse = (payload) => {
  return {
    code: payload?.code || DUPLICATE_CONFLICT_CODE,
    status: payload?.status || DEFAULT_STATUS_ERROR,
    message: payload.message,
    data: payload?.data || null,
  };
};

export const resNotFound: TResponse = (payload) => {
  return {
    code: payload?.code || NOT_FOUND_CODE,
    status: payload?.status || DEFAULT_STATUS_ERROR,
    message: payload.message ,
    data: payload?.data || null,
  };
};

export const handleError = (res: Response, error: any) => {
  console.error(error);

  const statusCode = error.status || error.code || 500;

  const message =
    statusCode === 500
      ? "Something went wrong. Please try again later."
      : error.message || "Something went wrong";

  return res.status(statusCode).json({
    code: statusCode,
    message,
    status: DEFAULT_STATUS_ERROR,
    data: null,
  });
};