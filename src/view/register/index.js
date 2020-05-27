import React, {Component} from 'react';
import {Form, Input, Select, Row, Col, Button, message,} from 'antd';
import Style from '../style.module.css';
import Config from "../../config/Config";
import {register, sendVerify} from "../../api";

const { Option } = Select;

class Register extends Component {

    formRef = React.createRef();

    onFinish = values => {
        register(values).then(response => {
            switch (response.code) {
                case Config.OK:
                    message.success("注册成功！");
                    // TODO 跳转至登录
                    break;
                case Config.SERVER_ERROR:
                    message.error("服务器故障！");
                    break;
                case Config.ACCOUNT_REGISTERED:
                    this.formRef.current.setFields([
                        {
                            name: 'username',
                            errors: ['该账号已注册！']
                        }
                    ]);
                    break;
                case Config.VERIFY_CODE_TIME_OUT:
                    this.formRef.current.setFields([
                        {
                            name: 'verify',
                            errors: ['验证码已超时！']
                        }
                    ]);
                    break;
                case Config.VERIFY_CODE_ERROR:
                    this.formRef.current.setFields([
                        {
                            name: 'verify',
                            errors: ['验证码错误！']
                        }
                    ])
                    break;
                default:
                    message.error("未知错误！错误码：" + response.code);
            }
        }).catch(error => {
            message.error("未知异常！");
        });
    };

    sendVerifyCode = () => {
        // 数据验证
        let values = this.formRef.current.getFieldValue('username');
        console.log(values);
        if (values === undefined || values.trim().length <= 0) {
            this.formRef.current.setFields([
                {
                    name: 'username',
                    errors: ['请填写邮箱！']
                }
            ]);
            return;
        }
        if (this.formRef.current.getFieldsError(['username'])[0].errors.length > 0) {
            return;
        }

        sendVerify(values.username, Config.REGISTER_DIALOG).then(response => {
            switch (response.code) {
                case Config.OK:
                    message.success("验证码发送成功！");
                    break;
                case Config.SERVER_ERROR:
                    message.error("服务器故障！");
                    break;
                default:
                    message.error("未知错误！错误码：" + response.code);
            }
        }).catch(error => {
            message.error("未知异常！");
        });
    }

    render() {
        return (
            <div className={Style.fillScreen}>
                <div className={[Style.center, Style.paddingTop40].join(" ")}>
                    <h1>注册</h1>
                </div>
                <Row className={Style.paddingTop40}>
                    <Col span={10} offset={6}>
                        <Form
                            ref={this.formRef}
                            labelCol={{span:8}}
                            wrapperCol={{span:16}}
                            name="register"
                            onFinish={this.onFinish}
                            scrollToFirstError
                        >
                            <Form.Item
                                name="username"
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
                                        <Button onClick={this.sendVerifyCode}>获取验证码</Button>
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

                            <Form.Item
                                name="name"
                                label="姓名"
                                rules={[{ required: true, message: '请输入你的姓名!', whitespace: true }]}
                            >
                                <Input placeholder={"请输入真实姓名"}/>
                            </Form.Item>

                            <Form.Item
                                name="sex"
                                label="性别"
                                rules={[{ required: true, message: '请选择性别!', whitespace: true }]}
                            >
                                <Select placeholder="请选择性别" allowClear>
                                    <Option value={"男"}>男</Option>
                                    <Option value={"女"}>女</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="address"
                                label="地址"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入地址!',
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input placeholder={"请输入地址"}/>
                            </Form.Item>

                            <Form.Item
                                name="phone"
                                label="电话"
                                rules={[
                                    {
                                        // type: 'regexp',
                                        pattern: /^1[3456789]\d{9}$/,
                                        message: '请输入正确的电话！'
                                    },
                                    {
                                        required: true,
                                        message: '请输入电话!',
                                    },

                                ]}
                                hasFeedback
                            >
                                <Input placeholder={"请输入电话"}/>
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