import React, {Component} from 'react';
import {Route, Switch, Redirect, withRouter} from "react-router-dom";
import { Layout, Menu } from 'antd';
import {MenuUnfoldOutlined, MenuFoldOutlined,} from '@ant-design/icons';
import Style from './main.module.css';
import {userRoutes} from "./routers";

const { Header, Sider, Content } = Layout;

// @withRouter
class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
        }
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    menuHandler = ({item, key, keyPath, domEvent}) =>  {
        this.props.history.push(key);
    }

    render() {
        return (
            <Layout className={Style.fillScreen}>
                <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                    <div className={Style.logo}>{this.state.collapsed ? "用户" : "零件销售管理系统"}</div>
                    <Menu theme="dark" mode="inline" onClick={this.menuHandler} selectedKeys={this.props.location.pathname}>
                        {userRoutes.map(item => {
                            return (
                                <Menu.Item key={item.pathname} icon={<item.icon/>}>{item.title}</Menu.Item>
                            )
                        })}
                    </Menu>
                </Sider>
                <Layout>
                    <Header className={Style.head}>
                        {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: Style.trigger,
                            onClick: this.toggle,
                        })}
                    </Header>
                    <Content className={Style.content}>
                        <Switch>
                            {userRoutes.map(item => {
                                return (
                                    <Route key={item.pathname} path={item.pathname} render={(rootProps => {
                                        return <item.component {...rootProps}/>
                                    })} />
                                )
                            })}
                            <Redirect from={"/user"} to={userRoutes[0].pathname}/>
                            <Redirect to={"/404"}/>
                        </Switch>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default User;