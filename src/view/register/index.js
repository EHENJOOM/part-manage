import React, {Component} from 'react';
import {Form, Input, Select, Row, Col, Button, } from 'antd';
import Style from '../style.module.css';
import Config from "../../config/Config";

const { Option } = Select;

class Register extends Component {

    onFinish = values => {
        console.log('Received values of form: ', values);
    };

    render() {
        return (
            <div className={Style.fillScreen}>
                <div className={[Style.center, Style.paddingTop80].join(" ")}>
                    <h1>注册</h1>
                </div>
                <Row className={Style.paddingTop40}>
                    <Col span={10} offset={6}>
                        <Form
                            labelCol={{span:8}}
                            wrapperCol={{span:16}}
                            name="register"
                            onFinish={this.onFinish}
                            scrollToFirstError
                        >
                            <Form.Item
                                name="email"
                                label="邮箱"
                                rules={[
                                    {
                                        type: 'email',
                                        message: '请输入正确的邮箱地址',
                                    },
                                    {
                                        required: true,
                                        message: '请输入邮箱地址!',
                                    },
                                ]}
                            >
                                <Input placeholder={"请输入邮箱"}/>
                            </Form.Item>

                            <Form.Item
                                name="name"
                                label="姓名"
                                rules={[{ required: true, message: '请输入你的姓名!', whitespace: true }]}
                            >
                                <Input placeholder={"请输入真实姓名"}/>
                            </Form.Item>

                            <Form.Item label="验证码">
                                <Row gutter={8}>
                                    <Col span={14}>
                                        <Form.Item
                                            name="verify"
                                            noStyle
                                            rules={[{ required: true, message: '请输入验证码!' }]}
                                        >
                                            <Input placeholder={"请输入验证码"}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={10} className={Style.right}>
                                        <Button>获取验证码</Button>
                                    </Col>
                                </Row>
                            </Form.Item>

                            <Form.Item
                                name="password"
                                label="密码"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入密码!',
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input.Password placeholder={"请输入密码"}/>
                            </Form.Item>

                            <Form.Item
                                name="confirm"
                                label="确认密码"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: '请再次确认密码!',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('输入的密码不匹配!');
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password placeholder={"请再次确认密码"}/>
                            </Form.Item>

                            <Form.Item name="type" label="权限"
                                       rules={[
                                           {
                                               required: true,
                                               message: '请选择账号类型！'
                                           },
                                       ]}
                            >
                                <Select placeholder="请选择账号类型" onChange={this.onTypeChange} allowClear>
                                    <Option value={Config.USER_LOGIN}>用户</Option>
                                    <Option value={Config.ADMIN_LOGIN}>管理员</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item wrapperCol={{offset:8, span:16}}>
                                <Row>
                                    <Col span={12}><Button type="primary" htmlType="submit">注册</Button></Col>
                                    <Col span={12} className={Style.right}><a className={Style.right} href={"/"}>返&nbsp;回</a></Col>
                                </Row>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Register;