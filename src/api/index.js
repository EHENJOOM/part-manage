import axios from "axios";
import {message} from "antd";
import {stringify} from "qs";
import Config from "../config/Config";

const isDev = process.env.NODE_ENV === 'development';

const service = axios.create({
    baseURL: isDev ? "http://101.200.49.246:8080/PartServer/" : "http://101.200.49.246:8080/PartServer/"
});

service.interceptors.request.use(config => {
    // config代表发送给服务器的信息，后期自己根据需要填充数据，自己配置即可

    // 兼容 post 跨域问题
    if (config.method === 'post') {
        // 修改 Content-Type
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        // 将对象参数转换为序列化的 URL 形式（key=val&key=val）
        config.data = stringify(config.data);
    }
    return config;
}, (error) => {
    console.log(error);
    return Promise.reject(error);
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
    return service.post(`SelectPart`, {
        page: page,
        pageSize: pageSize
    });
};

const login = values => {
    return service.post(`Login`, {
        username: values.username,
        password: values.password,
        type: values.type,
    });
};

const register = values => {
    return service.post(`Registers`, {
        username: values.username,
        password: values.password,
        type: values.type,
        name: values.name,
        address: values.address,
        phone: values.phone,
        verify: values.verify,
        sex: values.sex
    });
};

const forgetPassword = values => {
    return service.post(`ForgetPassword`, {
        username: values.username,
        password: values.password,
        verify: values.verify,
        type: values.type,
    });
};

const token = (userName, type, token) => {
    return service.post(`Token`, {
        username: userName,
        token: token,
        type: type
    });
};

const sendVerify = (userName, type) => {
    return service.post(`SendVerify`, {
        username: userName,
        type: type
    });
};

const addIntoCart = (userName, type, partId, count) => {
    return service.post(`addIntoCart`, {
        username: userName,
        type: type,
        part: partId,
        count: count
    });
};

const getCarts = (lid, page, pageSize) => {
    return service.post(`ShopCart`, {
        operate: Config.SELECT_OPERATE,
        lid: lid,
        page: page,
        pageSize: pageSize
    });
};

const getOrders = (lid, page, pageSize) => {
    return service.post(`Orders`, {
        operate: Config.SELECT_OPERATE,
        lid: lid,
        page: page,
        pageSize: pageSize,
    });
};

const deleteOrder = orderId => {
    return service.post(`Orders`, {
        operate: Config.DELETE_OPERATE,
        orderId: orderId,
    });
};

export {
    getPart,
    getOrders,
    login,
    token,
    register,
    deleteOrder,
    addIntoCart,
    getCarts,
    sendVerify,
    forgetPassword,
}