import axios from "axios";
import {BACKEND_URL} from '../Utils/constant'


export const login = async (props) => {
    
 const res = await axios.post(BACKEND_URL+"/admin/login",{
    email:props.email,
    password:props.password
 }, {
    withCredentials: true // Enable cookies to be sent with request
 });
  console.log(res?.data);

  return res?.data;
};

export const logout = async () => {
  try {
    const res = await axios.post(BACKEND_URL+"/admin/logout", {}, {
      withCredentials: true // Enable cookies to be sent with request
    });
    return res?.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Logout failed");
  }
};