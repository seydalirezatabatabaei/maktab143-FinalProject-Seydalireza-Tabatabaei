import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002",
});

// --------------------------------
// Request Interceptor
// --------------------------------

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.token = accessToken;
    }

    return config;
  }
);

// --------------------------------
// Response Interceptor
// --------------------------------

api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // اگر خطا 401 بود
    // و این درخواست قبلاً دوباره تلاش نشده بود
    if (
      error.response?.status === 401 &&
      !originalRequest?._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("Refresh token not found");
        }

        // گرفتن Access Token جدید
        const response = await axios.post(
          "http://localhost:3002/auth/refresh-token",
          {},
          {
            headers: {
              refreshToken: refreshToken,
            },
          }
        );

        const newAccessToken = response.data.accessToken;

        // ذخیره Access Token جدید
        localStorage.setItem(
          "accessToken",
          newAccessToken
        );

        // قرار دادن Token جدید روی همان درخواست
        originalRequest.headers.token = newAccessToken;

        // اجرای دوباره درخواست قبلی
        return api(originalRequest);

      } catch (refreshError) {
        console.error(
          "Refresh token failed:",
          refreshError
        );

        // اگر Refresh Token هم معتبر نبود
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // انتقال به صفحه Login
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;