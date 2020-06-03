import React, {Component} from 'react';
import {Button, message, Modal, Table, Tag, Tooltip} from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {deleteOrder, getOrders} from "../../api";
import Style from "../style.module.css";
import Config from "../../config/Config";
import Map from "../../util/configmap";
import DateFormat from "../../util/dateformat";

const {confirm} = Modal;

class Orders extends Component {

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
            <div>
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

    getOrders = (page, pageSize) => {
        this.setState({isLoading: true});
        getOrders(false, this.state.lid, page, pageSize).then(response => {
            switch (response.code) {
                case Config.OK:
                    var res = [];
                    for (let i = 0, length = response.data.length; i < length; i++) {
                        var temp = {
                            number: i + 1,
                            id: response.data[i]['id'],
                            isPaid: response.data[i]['isPaid'],
                            partCode: response.data[i]['partBean']['code'],
                            partName: response.data[i]['partBean']['name'],
                            price: response.data[i]['partBean']['price'],
                            count: response.data[i]['needCount'],
                            totalPrice:  response.data[i]['partBean']['price'] * response.data[i]['needCount'],
                            userCode: response.data[0]['userBean']['code'],
                            userName: response.data[0]['userBean']['name'],
                            buildTime: DateFormat.dateFormat(response.data[i]['orderDate']),
                            status: Map.mapStatusToChinese[response.data[i]['status']],
                            extend: response.data[i]['extend'],
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

    purchase = record => {

    }

    delete = record => {
        confirm({
            title: '确认删除此订单?',
            icon: <ExclamationCircleOutlined />,
            content: '',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                deleteOrder(record.id).then(response => {
                    switch (response.code) {
                        case Config.OK:
                            message.success("删除成功！");
                            break;
                        case Config.SERVER_ERROR:
                            message.error("服务器故障！");
                            break;
                        default:
                            message.error("未知故障！故障码：" + response.code);
                    }
                }).catch(error => {
                    message.error("未知异常！");
                });
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    onChange = (page, pageSize) => {
        this.getOrders(page, pageSize);
        this.setState({page, pageSize});
    }

    onShowSizeChange = (current, size) => {
        this.setState({page: current, pageSize: size});
        this.getOrders(current, size);
    }

    componentDidMount() {
        this.getOrders(this.state.page, this.state.pageSize);
    }

    columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            className: Style.invisible,
        },
        {
            title: 'isPaid',
            dataIndex: 'isPaid',
            key: 'isPaid',
            className: Style.invisible,
        },
        {
            title: '序号',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: '零件代码',
            dataIndex: 'partCode',
            key: 'partCode',
        },
        {
            title: '零件名称',
            dataIndex: 'partName',
            key: 'partName',
        },
        {
            title: '单价',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '数量',
            dataIndex: 'count',
            key: 'count',
        },
        {
            title: '总金额',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (text, record, index) => {
                return (
                    <Tooltip title={record.totalPrice >= 2000 ? "金额超过2000" : "金额小于2000"}>
                        <Tag color={record.totalPrice >= 2000 ? 'red' : 'green'}>{record.totalPrice.toFixed(2)}</Tag>
                    </Tooltip>
                )
            }
        },
        {
            title: '用户代码',
            dataIndex: 'userCode',
            key: 'userCode',
        },
        {
            title: '姓名',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: '订单创建时间',
            dataIndex: 'buildTime',
            key: 'buildTime',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: '备注',
            dataIndex: 'extend',
            key: 'extend',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record, index) => {
                return (
                    <div>
                        <Button className={record.isPaid === 603 ? Style.linkButton : Style.invisible} onClick={this.purchase.bind(this, record)} type={'link'}>支付</Button>
                        <Button className={Style.linkButton} onClick={this.delete.bind(this, record)} type={'link'} danger>删除</Button>
                    </div>
                )
            }
        }
    ]
}

export default Orders;