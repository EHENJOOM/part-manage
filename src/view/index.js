import Loadable from "react-loadable"
import Loading from "../component/loading";

const Login = Loadable({
    loader: () => import("./login"),
    loading: Loading
});
const Register = Loadable({
    loader: () => import("./register"),
    loading: Loading
});
const ForgetPassword = Loadable({
    loader: () => import("./forgetpsd"),
    loading: Loading
});
const NotFound = Loadable({
    loader: () => import("./notfound"),
    loading: Loading
});

const PartBank = Loadable({
    loader: () => import("./user/PartBank"),
    loading: Loading
});
const ShopCart = Loadable({
    loader: () => import("./user/ShopCart"),
    loading: Loading
});
const Orders = Loadable({
    loader: () => import("./user/Orders"),
    loading: Loading
});

export {
    Login,
    Register,
    ForgetPassword,
    NotFound,
    PartBank,
    ShopCart,
    Orders
}