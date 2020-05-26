import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import {ConfigProvider} from "antd";
import zhCN from "antd/es/locale/zh_CN";
import {HashRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import {commonRoutes} from "./routers";
import User from "./User";
import Admin from "./Admin";
import SuperAdmin from "./SuperAdmin";

ReactDOM.render(
    <ConfigProvider locale={zhCN}>
        <Router>
            <Switch>
                <Route path={"/user"} render={(rootProps) => {
                    // 授权检测
                    return <User {...rootProps}/>
                }}/>
                <Route path={"/admin"} render={rootProps => {
                    return <Admin {...rootProps}/>
                }}/>
                <Route path={"/super"} render={rootProps => {
                    return <SuperAdmin {...rootProps}/>
                }}/>
                {commonRoutes.map((item, index) => {
                    return <Route key={item.pathname} path={item.pathname} component={item.component}/>
                })}
                <Redirect from={"/"} to={"/login"}/>
                <Redirect to={"/404"}/>
            </Switch>
        </Router>
    </ConfigProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
