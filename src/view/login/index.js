import React, {Component} from 'react';
import {Form, Input, Button, Row, Col, Select, message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Style from '../style.module.css';
import Config from '../../config/Config';
import {login} from "../../api";
import Map from "../../util/configmap";

const { Option } = Select;

class Login extends Component {

    formRef = React.createRef();

    onFinish = values => {
        login(values).then(response => {
            switch (response.code) {
                case Config.OK:
                    localStorage.setItem("token", response.token);
                    localStorage.setItem("name", response.name);
                    localStorage.setItem("lid", response.lid);
                    this.props.history.push(Map.mapConfigToPath[values.type]);
                    message.success("登录成功！");
                    break;
                case Config.ACCOUNT_PSD_ERROR:
                    this.formRef.current.setFields([
                        {
                            name: 'password',
                            errors: ['账号或密码错误！']
                        }
                    ]);
                    break;
                case Config.USER_NOT_EXIST:
                    this.formRef.current.setFields([
                        {
                            name: 'username',
                            errors: ['该账号未注册！']
                        }
                    ]);
                    break;
                case Config.SERVER_ERROR:
                    message.error("服务器故障！");
                    break;
                default:
                    message.error("未知错误！错误码：" + response.code);
            }
        }).catch(error => {
            message.error("未知异常！");
            console.log(error);
        });
    };

    render() {
        return (
            <div className={Style.fillScreen}>
                <div className={[Style.center, Style.paddingTop80].join(" ")}>
                    <h1>零件销售管理系统</h1>
                </div>
                <Row className={Style.paddingTop40}>
                    <Col span={10} offset={6}>
                        <Form
                            ref={this.formRef}
                            hideRequiredMark
                            size={"middle"}
                            labelCol={{span:8}}
                            wrapperCol={{span:16}}
                            name="normal_login"
                            initialValues={{ remember: true }}
                            onFinish={this.onFinish}
                        >
                            <Form.Item name="username" label="账号" rules={[{ required: true, message: '请输入账号!（不带邮箱后缀）' }]}>
                                <Input prefix={<UserOutlined/>} placeholder="请输入账号" />
                            </Form.Item>
                            <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码!' }]}>
                                <Input.Password prefix={<LockOutlined/>} type="password" placeholder="请输入密码"/>
                            </Form.Item>
                            <Form.Item name="type" label="权限"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择账号类型！'
                                    },
                                ]}
                            >
                                <Select placeholder="请选择账号类型" allowClear>
                                    <Option value={Config.USER_LOGIN}>用户</Option>
                                    <Option value={Config.ADMIN_LOGIN}>管理员</Option>
                                    <Option value={Config.SUPER_ADMIN_LOGIN}>超级管理员</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item wrapperCol={{offset:8, span:16}}>
                                <Row>
                                    <Col span={12}><div className={Style.left}><a href={"/#/forgetpassword"}>忘记密码</a></div></Col>
                                    <Col span={12}><div className={Style.right}><a href={"/#/register"}>注册</a></div></Col>
                                </Row>
                            </Form.Item>

                            <Form.Item wrapperCol={{offset:8, span:16}}>
                                <Button type="primary" htmlType="submit" className={Style.matchParent}>登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Login;