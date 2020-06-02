import React, {Component} from 'react';
import {Avatar, Col, Dropdown, Layout, Menu, Row, withRouter} from "antd";
import MainStyle from "./main.module.css";
import {adminRoutes} from "./routers";
import {DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import {Redirect, Route, Switch} from "react-router-dom";

const { Header, Sider, Content } = Layout;

//@withRouter
class Admin extends Component {

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
                    <div className={MainStyle.logo}>{this.state.collapsed ? "商家" : "零件销售管理系统"}</div>
                    <Menu theme="dark" mode="inline" onClick={this.menuHandler} selectedKeys={this.props.location.pathname}>
                        {adminRoutes.map(item => {
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
                            {adminRoutes.map(item => {
                                return (
                                    <Route key={item.pathname} path={item.pathname} render={(rootProps => {
                                        return <item.component {...rootProps}/>
                                    })} />
                                )
                            })}
                            <Redirect from={"/admin"} to={adminRoutes[0].pathname}/>
                            <Redirect to={"/404"}/>
                        </Switch>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default Admin;