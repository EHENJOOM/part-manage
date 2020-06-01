import React, {Component} from 'react';
import {Button, message, Table, Tag, Tooltip} from "antd";
import {addIntoCart, getPart} from "../../api";
import Config from "../../config/Config";
import Style from "../style.module.css";

class PartBank extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            total: 0,
            page: 1,
            pageSize: 5,
            columns: [],
            isLoading: true,
        }
    }

    render() {
        return (
            <div>
                <Table
                    loading={this.state.isLoading}
                    columns={this.columns}
                    rowKey={record => record.id}
                    dataSource={this.state.dataSource}
                    pagination={{current: this.state.page, total: this.state.total, pageSize: this.state.pageSize, onChange: this.change, onShowSizeChange: this.onShowSizeChange}}
                />
            </div>
        );
    }

    getPartBank = (page, pageSize) => {
        this.setState({isLoading: true});
        getPart(page, pageSize).then(response => {
            if (response.code === Config.OK) {
                var res = [];
                for (let i = 0, length = response.data.length; i < length; i++) {
                    var temp = {
                        number: i + 1,
                        id: response.data[i]['id'],
                        code: response.data[i]['code'],
                        name: response.data[i]['name'],
                        count: response.data[i]['count'],
                        price: response.data[i]['price']
                    }
                    res.push(temp);
                }
                this.setState({
                    dataSource: res,
                    total: response.total,
                });
            } else if (response.code === Config.SERVER_ERROR) {
                message.error("服务器故障！故障码：" + response.code);
            }
        }).catch(error => {
            message.error("未知异常！");
            console.log(error);
        }).finally(() => {
            this.setState({isLoading: false});
        });
    }

    addIntoCart = record => {
        addIntoCart(localStorage.getItem("username"), localStorage.getItem("type"), record.id, 1).then(response => {
            switch (response.code) {
                case Config.OK:
                    message.success("加入购物车成功！");
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

    // 页数据量及当前页改变事件
    onShowSizeChange = (current, size) => {
        this.setState({
            page: current,
            pageSize: size
        });
        this.getPartBank(current, size);
    }

    // 页切换事件
    change = (page, pageSize) => {
        this.getPartBank(page, pageSize);
        this.setState({page, pageSize});
    }

    componentDidMount() {
        this.getPartBank(this.state.page, this.state.pageSize);
    }

    columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            className: Style.invisible
        },
        {
            title: '序号',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: '零件代码',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '库存量',
            dataIndex: 'count',
            key: 'count',
            render: (text, record, index) => {
                return (
                    <Tooltip title={record.count >= 50 ? "库存量高于50" : "库存量低于50"}>
                        <Tag color={record.count >= 50 ? "green" : "red"}>{record.count}</Tag>
                    </Tooltip>
                )
            },
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record, index) => {
                return <Button type={"link"} className={Style.linkButton} onClick={this.addIntoCart.bind(this, record)}>加入购物车</Button>
            }
        }
    ]
}

export default PartBank;