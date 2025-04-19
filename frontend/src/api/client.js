import axios from "axios";
import toast from "react-hot-toast";

export const apiClient = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  // withCredentials: true
})

apiClient.interceptors.request.use(
  (config) => {

    if (!config?.headers?.NoAuth) {
        const token = localStorage.getItem("accessToken")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    // if (response.data) {
    //   console.log(response.data.message)
    //   toast.success(response.data.message)
    // }
    return Promise.resolve(response)
  },
  (error) => {
    console.log(error)
    if (error.response) {
          const { statusCode, message } = error.response.data
          
          if(statusCode === 401) {
            localStorage.removeItem("accessToken")
            toast.error("Unauthorized!!!")
            // home page
          } 
          else if (statusCode === 500) {
            toast.error("Server error! Please try again later")
          }
          else {
            toast.error(message || "An error occurred.")
          }
    }  
    else{
      toast.error("Network error! Check your internet connection.")
    }

    return Promise.reject(error)
  }
)