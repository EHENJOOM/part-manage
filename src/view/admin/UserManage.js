import React, {Component} from 'react';
import {message, Table, Tag} from "antd";
import Config from "../../config/Config";
import {getUsers} from "../../api";
import Style from "../style.module.css";
import MainStyle from "../../main.module.css";

class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            total: 0,
            page: 1,
            pageSize: 5,
            columns: [],
            isLoading: true,
            lid: localStorage.getItem("lid"),
        }
    }

    render() {
        return (
            <div className={MainStyle.content}>
                <Table
                    loading={this.state.isLoading}
                    columns={this.columns}
                    rowKey={record => record.id}
                    dataSource={this.state.dataSource}
                    pagination={{current: this.state.page, total: this.state.total, pageSize: this.state.pageSize, onChange: this.onChange, onShowSizeChange: this.onShowSizeChange}}
                />
            </div>
        );
    }

    getUsers = (page, pageSize) => {
        getUsers(page, pageSize).then(response => {
            switch (response.code) {
                case Config.OK:
                    var res = [];
                    for (let i = 0, length = response.data.length; i < length; i++) {
                        var temp = {
                            number: i + 1,
                            id: response.data[i]['id'],
                            code: response.data[i]['code'],
                            name: response.data[i]['name'],
                            sex: response.data[i]['sex'],
                            address: response.data[i]['address'],
                            phone: response.data[i]['phone'],
                        };
                        res.push(temp);
                    }
                    this.setState({
                        dataSource: res,
                        total: response.total,
                    });
                    break;
                case Config.SERVER_ERROR:
                    message.error("服务器故障！");
                    break;
                default:
                    message.error("未知错误！错误码：" + response.code);
            }
        }).catch(error => {
            message.error("未知异常！");
        }).finally(() => {
            this.setState({isLoading: false});
        });
    }

    componentDidMount() {
        this.getUsers(this.state.page, this.state.pageSize);
    }

    columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            className: Style.invisible,
        },
        {
            title: '用户代码',
            key: 'code',
            dataIndex: 'code',
        },
        {
            title: '姓名',
            key: 'name',
            dataIndex: 'name',
        },
        {
            title: '性别',
            key: 'sex',
            dataIndex: 'sex',
            render: (text, record, index) => {
                return (
                    <Tag color={record.sex === '男' ? 'blue' : 'pink'}>{record.sex}</Tag>
                )
            }
        },
        {
            title: '电话',
            key: 'phone',
            dataIndex: 'phone',
        },
        {
            title: '地址',
            key: 'address',
            dataIndex: 'address',
        },
    ]
}

export default UserManage;