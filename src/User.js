import React, {Component} from 'react';
import {Route, Switch, Redirect, withRouter} from "react-router-dom";
import {Avatar, Col, Dropdown, Layout, Menu, Row} from 'antd';
import {MenuUnfoldOutlined, MenuFoldOutlined, DownOutlined,} from '@ant-design/icons';
import MainStyle from './main.module.css';
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

    menus = () => {
        return (
            <Menu onClick={this.menuHandler}>
                <Menu.Item key={'/login'}>退出</Menu.Item>
            </Menu>
        )
    }

    render() {
        return (
            <Layout className={MainStyle.fillScreen}>
                <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                    <div className={MainStyle.logo}>{this.state.collapsed ? "用户" : "零件销售管理系统"}</div>
                    <Menu theme="dark" mode="inline" onClick={this.menuHandler} selectedKeys={this.props.location.pathname}>
                        {userRoutes.map(item => {
                            return (
                                <Menu.Item key={item.pathname} icon={<item.icon/>}>{item.title}</Menu.Item>
                            )
                        })}
                    </Menu>
                </Sider>
                <Layout>
                    <Header className={MainStyle.head}>
                        <Row>
                            <Col span={8}>
                                {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                    className: MainStyle.trigger,
                                    onClick: this.toggle,
                                })}
                            </Col>
                            <Col span={4} offset={12}>
                                <Dropdown overlay={this.menus()}>
                                    <div>
                                        <Avatar className={MainStyle.headerImage}>{localStorage.getItem("name").substring(0, 1)}</Avatar>&nbsp;&nbsp;
                                        <span className={MainStyle.headerName}>{localStorage.getItem("name")}</span>&nbsp;<DownOutlined/>
                                    </div>
                                </Dropdown>
                            </Col>
                        </Row>
                    </Header>
                    <Content className={MainStyle.content}>
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