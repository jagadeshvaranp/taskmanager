export const BASE_URL = "https://taskmanager-backend-one.vercel.app/";

export const API_PATHS = {
  AUTH: {
    REGISTER: `${BASE_URL}/api/auth/register`,
    LOGIN: `${BASE_URL}/api/auth/login`,
    GET_PROFILE: `${BASE_URL}/api/auth/profile`,
  },

  USERS: {
    GET_ALL_USERS: `${BASE_URL}/api/users`,
    GET_USER_BY_ID: (userId) => `${BASE_URL}/api/users/${userId}`,
    CREATE_USER: `${BASE_URL}/api/users`,
    UPDATE_USER: (userId) => `${BASE_URL}/api/users/${userId}`,
    DELETE_USER: (userId) => `${BASE_URL}/api/users/${userId}`,
  },

  TASKS: {
    // I have added ${BASE_URL} to all these paths:
    GET_DASHBOARD_DATA: `${BASE_URL}/api/tasks/dashboard-data`,
    GET_USER_DASHBOARD_DATA: `${BASE_URL}/api/tasks/user-dashboard-data`,
    GET_ALL_TASKS: `${BASE_URL}/api/tasks`,
    GET_TASK_BY_ID: (taskId) => `${BASE_URL}/api/tasks/${taskId}`,
    CREATE_TASK: `${BASE_URL}/api/tasks`,
    UPDATE_TASK: (taskId) => `${BASE_URL}/api/tasks/${taskId}`,
    DELETE_TASK: (taskId) => `${BASE_URL}/api/tasks/${taskId}`,
    UPDATE_TASK_STATUS: (taskId) => `${BASE_URL}/api/tasks/${taskId}/status`,
    UPDATE_TODO_CHECKLIST: (taskId) => `${BASE_URL}/api/tasks/${taskId}/todo`,
  },

  IMAGE: {
    UPLOAD_IMAGE: `${BASE_URL}/api/auth/upload-image`,
  },
};