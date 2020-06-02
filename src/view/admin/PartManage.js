import React, {Component} from 'react';
import {Button, Form, message, Modal, Table, Tag, Tooltip} from "antd";
import EditableContext, {EditableCell} from "../../component/editable";
import Style from "../style.module.css";
import {getPart} from "../../api";
import Config from "../../config/Config";
import {ExclamationCircleOutlined} from "@ant-design/icons";

const {confirm} = Modal;

class PartManage extends Component {

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
                <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                    增加
                </Button>
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
        if (key.length > 6) {
            const { data } = this.state;
            const newData = data;
            newData.splice(data.length - 1, 1);
            this.setState({ data: newData, editingKey: key });
        }
        this.setState({ editingKey: '' });
    };

    delete = (key) => {
        confirm({
            title: '是否删除此零件?',
            icon: <ExclamationCircleOutlined />,
            content: '',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                const { data } = this.state;
                const newData = [...data];
                const index = newData.findIndex((item) => key === item.key);
                newData.splice(index, 1);
                this.setState({ data: newData,});
                // TODO 调用api删除
            },
        });
    };

    save(form, record) {
        let list = this.formRef.current.getFieldsError();
        for (let i = 0, temp = list[i]; i < list.length; i++, temp = list[i]) {
            if (temp.errors.length > 0) {
                return;
            }
        }
        const { data } = this.state;
        const row = this.formRef.current.getFieldsValue();
        data[record.number - 1].code = row.code;
        data[record.number - 1].name = row.name;
        data[record.number - 1].count = row.count;
        data[record.number - 1].price = row.price;
        this.setState({data, editingKey: ''});
        // TODO 调用api保存
    }

    handleAdd = () => {
        const { data, editingKey } = this.state;
        if (editingKey !== '') {
            message.error('请先保存');
            return;
        }
        const key = (data.length + 1).toString();
        const row = {
            key,
            number: data.length + 1,
            name: '',
            code: '',
            count: 0,
            price: 0,
        };
        const newData = [...data];
        newData.splice(data.length, 1, row);
        this.setState({ data: newData, editingKey: key });
    };

    onShowSizeChange = (current, size) => {
        this.setState({
            page: current,
            pageSize: size
        });
        this.getParts(current, size);
    }

    // 页切换事件
    change = (page, pageSize) => {
        this.getParts(page, pageSize);
        this.setState({page, pageSize});
    }

    componentDidMount() {
        this.getParts(this.state.page, this.state.pageSize);
    }

    getParts = (page, pageSize) => {
        this.setState({isLoading: true});
        getPart(page, pageSize).then(response => {
            if (response.code === Config.OK) {
                var res = [];
                for (let i = 0, length = response.data.length; i < length; i++) {
                    var temp = {
                        key: i.toString(),
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
                    data: res,
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

    columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            editable: false,
            className: Style.invisible
        },
        {
            title: '序号',
            dataIndex: 'number',
            editable: false,
        },
        {
            title: '零件代码',
            dataIndex: 'code',
            editable: true,
        },
        {
            title: '名称',
            dataIndex: 'name',
            editable: true,
        },
        {
            title: '库存量',
            dataIndex: 'count',
            editable: true,
            render: (text, record, index) => {
                return (
                    <Tooltip title={record.count >= 50 ? "库存量高于50" : "库存量低于50"}>
                        <Tag color={record.count >= 50 ? "green" : "red"}>{record.count}</Tag>
                    </Tooltip>
                )
            },
        },
        {
            title: '单价',
            dataIndex: 'price',
            width: '15%',
            editable: true,
            render: (text, record, index) => {
                return (
                    <Tooltip title={record.price >= 2000 ? '单价高于2000元' : '单价低于2000元'}>
                        <Tag color={record.price >= 2000 ? 'red' : 'green'}>{record.price.toFixed(2)}</Tag>
                    </Tooltip>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'action',
            render: (text, record, index) => {
                const { editingKey } = this.state;
                const editable = this.isEditing(record);
                return editable ? (
                    <span>
                            <EditableContext.Consumer>
                                {(form) => (
                                    <Button onClick={() => this.save(form, record)} type={"link"} className={Style.linkButton}>
                                        保存
                                    </Button>
                                )}
                            </EditableContext.Consumer>
                            <Button className={Style.linkButton} type={"link"} onClick={() => this.cancel(record.key)}>取消</Button>
                        </span>
                ) : (
                    <div>
                        <Button disabled={editingKey !== ''} className={Style.linkButton} type={"link"} onClick={() => this.edit(record)}>编辑</Button>
                        <Button disabled={editingKey !== ''} className={Style.linkButton} type={"link"} danger onClick={() => this.delete(record.key)}>删除</Button>
                    </div>
                );
            }
        }
    ];

}

export default PartManage;