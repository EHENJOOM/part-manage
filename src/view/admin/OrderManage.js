import React, {Component} from 'react';
import {Button, Form, message, Table, Tag, Tooltip} from "antd";
import Config from "../../config/Config";
import EditableContext, {EditableCell} from "../../component/editable";
import {getOrders} from "../../api";
import Style from "../style.module.css";
import DateFormat from "../../util/dateformat";
import Map from "../../util/configmap";
import MainStyle from "../../main.module.css";

class OrderManage extends Component {

    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            editingKey: '',
            total: 0,
            page: 1,
            pageSize: 5,
            isLoading: true,
            lid: localStorage.getItem("lid"),
        };
    }

    render() {
        const components = {
            body: {
                cell: EditableCell,
            },
        };
        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: (record) => ({
                    record,
                    inputType: col.dataIndex === 'count' || col.dataIndex === 'price' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    step: col.dataIndex === 'price' ? 0.01 : 1,
                    editing: this.isEditing(record),
                }),
            };
        });
        const { data } = this.state;
        const { form } = this.props;
        return (
            <EditableContext.Provider value={form}>
                <div className={MainStyle.content}>
                    <Form ref={this.formRef}>
                        <Table
                            components={components}
                            dataSource={data}
                            columns={columns}
                            rowClassName="editable-row"
                            loading={this.state.isLoading}
                            rowKey={record => record.id}
                            pagination={{current: this.state.page, total: this.state.total, pageSize: this.state.pageSize, onChange: this.change, onShowSizeChange: this.onShowSizeChange}}
                        />
                    </Form>
                </div>
            </EditableContext.Provider>
        );
    }

    isEditing = (record) => {
        const { editingKey } = this.state;
        return record.key === editingKey;
    };

    edit = (key) => {
        this.setState({ editingKey: key.key });
    };

    cancel = (key) => {
        console.log(key);
        if (key.length > 6) {
            const { data } = this.state;
            const newData = data;
            newData.splice(data.length - 1, 1);
            this.setState({ data: newData, editingKey: key });
        }
        this.setState({ editingKey: '' });
    };

    delete = (key) => {

    }

    save(form, record) {

    }

    detail = record => {
        this.props.history.push({pathname: '/admin/order/detail', query: {param: record}});
    }

    onShowSizeChange = (current, size) => {
        this.setState({
            page: current,
            pageSize: size
        });
        this.getOrders(current, size);
    }

    // 页切换事件
    change = (page, pageSize) => {
        this.getOrders(page, pageSize);
        this.setState({page, pageSize});
    }

    componentDidMount() {
        this.getOrders(this.state.page, this.state.pageSize);
    }

    getOrders = (page, pageSize) => {
        getOrders(true, null, page, pageSize).then(response => {
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
                            sex: response.data[0]['userBean']['sex'],
                            address: response.data[0]['userBean']['address'],
                            phone: response.data[0]['userBean']['phone'],
                            buildTime: DateFormat.dateFormat(response.data[i]['orderDate']),
                            latestTime: DateFormat.dateFormat(response.data[i]['paymentDate']),
                            payTime: DateFormat.dateFormat(response.data[i]['payDate']),
                            status: Map.mapStatusToChinese[response.data[i]['status']],
                            extend: response.data[i]['extend'],
                            aat: response.data[i]['suggest'],
                        };
                        res.push(temp);
                    }
                    this.setState({
                        data: res,
                        total: response.total,
                    });
                    break;
                case Config.SERVER_ERROR:
                    message.error("服务器故障！");
                    break;
                default:
                    message.error("未知故障！故障码：" + response.code);
            }
        }).catch(error => {
            message.error("未知异常！");
            console.log(error);
        }).finally(() => {
            this.setState({isLoading: false});
        });
    }

    columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            editable: false,
            className: Style.invisible,
        },
        {
            title: '序号',
            dataIndex: 'number',
            editable: false,
        },
        {
            title: '零件代码',
            dataIndex: 'partCode',
            editable: false,
        },
        {
            title: '零件名称',
            dataIndex: 'partName',
            editable: false,
        },
        {
            title: '单价',
            dataIndex: 'price',
            key: 'price',
            editable: false,
        },
        {
            title: '数量',
            dataIndex: 'count',
            key: 'count',
            editable: false,
        },
        {
            title: '总金额',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            editable: false,
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
            editable: false,
            className: Style.invisible,
        },
        {
            title: '用户姓名',
            dataIndex: 'userName',
            key: 'userName',
            editable: false,
        },
        {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
            editable: false,
            className: Style.invisible,
            render: (text, record, index) => {
                return <Tag color={record.sex === '男' ? 'blue' : 'pink'}>{record.sex}</Tag>
            }
        },
        {
            title: '电话',
            key: 'phone',
            dataIndex: 'phone',
            editable: false,
            className: Style.invisible,
        },
        {
            title: '地址',
            key: 'address',
            dataIndex: 'address',
            editable: false,
            className: Style.invisible,
        },
        {
            title: '订单创建日期',
            dataIndex: 'buildTime',
            key: 'buildTime',
            editable: false,
        },
        {
            title: '最晚支付日期',
            dataIndex: 'latestTime',
            key: 'latestTime',
            editable: false,
            className: Style.invisible,
        },
        {
            title: '支付日期',
            dataIndex: 'payTime',
            key: 'payTime',
            editable: false,
            className: Style.invisible,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            editable: false,
        },
        {
            title: '备注',
            dataIndex: 'extend',
            key: 'extend',
            editable: true,
            className: Style.invisible,
        },
        {
            title: '平均欠款时间',
            dataIndex: 'aat',
            key: 'aat',
            editable: false,
            render: (text, record, index) => {
                return (
                    <Tooltip
                        color={record.aat < 3 ? 'green' : record.aat < 5 ? 'blue' : record.aat < 7 ? 'yellow' : record.aat < 10 ? 'orange' : 'red'}
                        title={'信用' + (record.aat < 3 ? '非常好' : record.aat < 5 ? '良好' : record.aat < 7 ? '一般' : record.aat < 10 ? '差' : '非常差')}
                    >
                        <Tag color={record.aat < 3 ? 'success' : record.aat < 5 ? 'processing' : record.aat < 7 ? 'gold' : record.aat < 10 ? 'warning' : 'error'}>{record.aat + '天'}</Tag>
                    </Tooltip>
                )
            },
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record, index) => {
                return (
                    <div>
                        <Button type={'link'} className={Style.linkButton} onClick={this.detail.bind(this, record)}>查看</Button>
                    </div>
                )
            }
        },
    ]

}

export default OrderManage;