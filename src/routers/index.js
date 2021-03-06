import {
    ForgetPassword,
    Login,
    NotFound, OrderDetail,
    OrderManage,
    Orders,
    PartBank,
    PartManage,
    Register,
    ShopCart,
    UserManage
} from "../view";
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
        pathname: '/user/order',
        component: Orders,
        title: '订单',
        icon: UploadOutlined
    }

]

const adminRoutes = [
    {
        pathname: '/admin/user',
        title: '用户管理',
        visible: true,
        exact: true,
        component: UserManage,
        icon: UserOutlined,
    },
    {
        pathname: '/admin/part',
        title: '零件管理',
        visible: true,
        exact: true,
        component: PartManage,
        icon: VideoCameraOutlined,
    },
    {
        pathname: '/admin/order',
        title: '订单管理',
        visible: true,
        exact: true,
        component: OrderManage,
        icon: UploadOutlined,
    },
    {
        pathname: '/admin/order/detail',
        title: '订单详情',
        visible: false,
        exact: false,
        component: OrderDetail,
        icon: UploadOutlined,
    },
]

const superAdminRoutes = [

]

export {
    commonRoutes,
    userRoutes,
    adminRoutes,
    superAdminRoutes
}