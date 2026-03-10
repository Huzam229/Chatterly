import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chatterly-backend-sigma.vercel.app/api",
  withCredentials: true, // send the cookies with the request
});

// live baseUlr :  baseURL: "https://chatterly-backend-sigma.vercel.app/api",

// local baseUrl:  baseURL: "http://localhost:5001/api",
