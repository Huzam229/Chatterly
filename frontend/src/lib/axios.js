import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chatterly-backend-sigma.vercel.app/api",
  withCredentials: true, // send the cookies with the request
});
