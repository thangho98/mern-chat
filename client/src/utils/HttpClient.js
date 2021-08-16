import axios from "axios";
import { setupCache } from "axios-cache-adapter";
import AppConfig from "../config";
import ERRORS from "../contants/errors";
import { TOKEN_USER } from "../contants/token";

export function serialize(obj) {
  var str = [];
  for (var p in obj)
    if (Object.prototype.hasOwnProperty.call(obj, p)) {
      if (obj[p] === null || obj[p] === undefined || obj[p] === "") continue;
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

const { BASE_API_URL, NETWORK_TIMEOUT } = AppConfig;

const cache = setupCache({
  maxAge: 15 * 60 * 1000,
  debug: false,
  exclude: {
    query: false
  },
  invalidate: async (config, request) => {
    if (request.clearCacheEntry) {
      await config.store.removeItem(config.uuid);
    }
  }
});

export const handleErrorResponse = error => {
  return Promise.reject(error ? (error.response ? error.response.data : error) : error);
};

const errorDisplay = (notifyHandler, message, error_id) => {
  if (!message) return;
  if (!notifyHandler.isActive(error_id)) {
    notifyHandler(message, {
      type: "error",
      toastId: error_id
    });
  }
};

const errorHandler = async (error, notifyHandler, invalidTokenHandler = null, additionalInfo = null) => {
  if (!error) {
    errorDisplay(notifyHandler);
    return "Network Error";
  }
  if (error.code === "ECONNABORTED") {
    errorDisplay(notifyHandler, "Request timeout, please try again later.", ERRORS.NETWORK_ERROR);
    return Promise.reject({ ...error });
  }

  const response = error.response;

  if (!response) {
    errorDisplay(notifyHandler, "Network Error", ERRORS.NETWORK_ERROR);
    return error;
  }

  switch (response.status) {
    case 401:
      if (invalidTokenHandler) invalidTokenHandler();
      break;
    case 403:
    case 400:
    case 429:
      errorDisplay(notifyHandler, response.data.message, ERRORS.REQUEST_ERROR);
      break;
    default:
      errorDisplay(notifyHandler, response.data.message, ERRORS.INTERNAL_ERROR);
      console.error(error, additionalInfo);
      break;
  }

  return Promise.reject(response.data);
};

const instance = axios.create({
  baseURL: BASE_API_URL,
  adapter: cache.adapter,
});
instance.defaults.timeout = NETWORK_TIMEOUT;
instance.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem(TOKEN_USER);
  config.headers.Authorization =  accessToken ? `Bearer ${accessToken}` : '';
  return config;
});

const post = (url = "", data = "", config = {}) => instance.post(url, data, config);

const get = (url, config) => instance.get(url, config);

const put = (url = "", data = "", config = {}) => instance.put(url, data, config);

const patch = (url = "", data = "", config = {}) => instance.patch(url, data, config);

const del = (url = "", data = "", config = {}) => instance.delete(url, { ...config, data: data });

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

const HttpClient =  {
  post,
  get,
  put,
  patch,
  delete: del,
  getInstance: instance,
  delay,
  errorHandler
};

export default HttpClient;