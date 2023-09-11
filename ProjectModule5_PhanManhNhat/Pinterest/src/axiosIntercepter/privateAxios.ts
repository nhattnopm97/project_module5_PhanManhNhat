import axios from "axios";

const baseURL = "http://localhost:3333";

const privateAxios = axios.create({
  baseURL,
});

privateAxios.interceptors.request.use((config: any) => {
  let userLocalJson = localStorage.getItem("userLocal");
  let userLocal = userLocalJson ? JSON.parse(userLocalJson) : null;

  return {
    ...config,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userLocal.token}`,
    },
  };
});

export default privateAxios;
