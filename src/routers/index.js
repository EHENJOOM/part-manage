import {ForgetPassword, Login, NotFound, Orders, PartBank, Register, ShopCart} from "../view";
import {UserOutlined, VideoCameraOutlined, UploadOutlined,} from '@ant-design/icons';

const commonRoutes = [
    {
        pathname: '/login',
        component: Login
    },
    {
        pathname: '/register',
        component: Register
    },
    {
        pathname: '/forgetpassword',
        component: ForgetPassword
    },
    {
        pathname: '/404',
        component: NotFound
    }
]

const userRoutes = [
    {
        pathname: '/user/part',
        component: PartBank,
        title: '零件库',
        icon: UserOutlined
    },
    {
        pathname: '/user/cart',
        component: ShopCart,
        title: '购物车',
        icon: VideoCameraOutlined
    },
    {
        pathname: '/user/orders',
        component: Orders,
        title: '订单',
        icon: UploadOutlined
    }

]

const adminRoutes = [

]

const superAdminRoutes = [

]

export {
    commonRoutes,
    userRoutes,
    adminRoutes,
    superAdminRoutes
}