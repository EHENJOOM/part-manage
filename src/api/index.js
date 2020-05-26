import axios from "axios";
import {message} from "antd";

const isDev = process.env.NODE_ENV === 'development';

const service = axios.create({
    baseURL: isDev ? "http://101.200.49.246:8080/PartServer/" : "http://101.200.49.246:8080/PartServer/"
});

service.interceptors.request.use(config => {
    // config代表发送给服务器的信息，后期自己根据需要填充数据，自己配置即可
    return config;
});

service.interceptors.response.use(response => {
    if (response.status === 200) {
        console.log(response.data);
        return response.data;
    } else {
        // 统一处理错误
        message.error("系统繁忙，请稍后再试！")
    }
});

const getPart = (page, pageSize) => {
    return service.post(`SelectPart?page=${page}&pageSize=${pageSize}`);
}

const login = values => {
    return service.post(`Login?username=${values.username}&password=${values.password}&type=${values.type}`);
}

export {
    getPart,
    login,
}