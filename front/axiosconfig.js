import axios from 'axios';

const instance = axios.create({
    withCredentials : true,
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    // headers:{Set-cookies}
});

instance.interceptors.response.use({}, (error) => {
    const data = error.response.data;
    const originalRequest= error.config;
    if(error.response.status===403){
        return axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/refreshToken`,{withCredentials:true}).then((res)=>{
            if(res.status===201){
                return axios(originalRequest)
            }
        })
    }
    
    return Promise.reject(error)
})

export default instance;