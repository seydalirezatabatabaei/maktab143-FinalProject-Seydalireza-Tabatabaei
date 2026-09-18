import api from "./axios";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", {
    username,
    password,
  });

  return response.data;
};