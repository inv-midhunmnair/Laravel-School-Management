import axiosInstance from "./axios.interceptor";
import { API_ENDPOINTS } from "./api.constants";

export const loginUser = async (username: string, password: string) => {
  const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
    username,
    password,
  });
  return response.data;
};

export const teacherOperations = async (teacherData: any) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.CRUD_TEACHER,
    teacherData
  );
  return response.data;
};

export const studentOperations = async (studentData: any) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.CRUD_STUDENT,
    studentData
  );
  return response.data;
};
