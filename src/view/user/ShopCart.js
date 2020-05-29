import React, {Component} from 'react';
import {Button, Form, message, Table, Tag, Tooltip} from "antd";
import {getCarts} from "../../api";
import EditableContext, {EditableCell} from "../../component/editable/index";
import Config from "../../config/Config";
import Style from "../style.module.css";

class EditableTable extends React.Component {

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
            userName: localStorage.getItem("username"),
            type: localStorage.getItem("type"),
        };
        this.columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                editable: false,
                className: Style.invisible
            },
            {
                title: '序号',
                dataIndex: 'number',
                width: '15%',
                editable: false,
            },
            {
                title: '零件代码',
                dataIndex: 'code',
                width: '15%',
                editable: false,
            },
            {
                title: '名称',
                dataIndex: 'name',
                width: '20%',
                editable: false,
            },
            {
                title: '数量',
                dataIndex: 'count',
                editable: true,
            },
            {
                title: '总金额',
                dataIndex: 'price',
                editable: false,
                render: (text, record, index) => {
                    return (
                        <Tooltip title={record.price >= 2000 ? "金额超过2000" : "金额小于2000"}>
                            <Tag color={record.price >= 2000 ? 'red' : 'green'}>{record.price}</Tag>
                        </Tooltip>
                    )
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
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
                            <Button className={Style.linkButton} type={"link"}>取消</Button>
                        </span>
                    ) : (
                        <div>
                            <Button disabled={editingKey !== ''} className={Style.linkButton} type={"link"} onClick={() => this.edit(record.key)}>编辑</Button>
                            <Button disabled={editingKey !== ''} className={Style.linkButton} type={"link"} danger onClick={() => this.delete(record.key)}>删除</Button>
                        </div>
                    );
                },
            },
        ];
    }

    isEditing = (record) => {
        const { editingKey } = this.state;
        return record.key === editingKey;
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
        console.log(key);
        const { data } = this.state;
        const newData = [...data];
        const index = newData.findIndex((item) => key === item.key);
        newData.splice(index, 1);
        this.setState({ data: newData,});
    };

    save(form, record) {
        let list = this.formRef.current.getFieldsError();
        for (let i = 0, temp = list[i]; i < list.length; i++, temp = list[i]) {
            if (temp.errors.length > 0) {
                return;
            }
        }
        const row = this.formRef.current.getFieldsValue();
        const { data } = this.state;
        data[record.number - 1].price = row.count * data[record.number - 1].price / data[record.number - 1].count;
        data[record.number - 1].count = row.count;
        this.setState({data, editingKey: ''});
    }

    edit = (key) => {
        this.setState({ editingKey: key });
    };

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
            name: '新零件',
            code: 'NC_202309',
            count: 1,
            price: 200,
        };
        const newData = [...data];
        newData.splice(data.length, 1, row);
        this.setState({ data: newData, editingKey: key });
    };

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
                    inputType: col.dataIndex === 'count' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
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

    getData = (page, pageSize) => {
        getCarts(this.state.userName, this.state.type, page, pageSize).then(response => {
            switch (response.code) {
                case Config.OK:
                    var res = [];
                    for (let i = 0, length = response.data.length; i < length; i++) {
                        var temp = {
                            key: i.toString(),
                            id: response.data[i]['id'],
                            number: i + 1,
                            code: response.data[i]['partBean']['code'],
                            name: response.data[i]['partBean']['name'],
                            count: response.data[i]['needCount'],
                            price: response.data[i]['needCount'] * response.data[i]['partBean']['price'],
                        }
                        res.push(temp);
                    }
                    this.setState({
                        data: res,
                    });
                    break;
                case Config.SERVER_ERROR:
                    message.error("服务器故障！");
                    break;
                case Config.ILLEGAL_OPERATE:
                    message.error("非法操作！");
                    break;
                default:
                    message.error("未知故障！故障码：" + response.code);
            }
        }).catch(error => {
            message.error("未知异常！");
        }).finally(() => {
            this.setState({isLoading: false});
        });
    }

    // 页数据量及当前页改变事件
    onShowSizeChange = (current, size) => {
        this.setState({
            page: current,
            pageSize: size
        });
        this.getData(current, size);
    }

    // 页切换事件
    change = (page, pageSize) => {
        this.getData(page, pageSize);
        this.setState({page, pageSize});
    }

    purchase = record => {
        console.log(record);
    }

    componentDidMount() {
        this.getData(this.state.page, this.state.pageSize);
    }
}

class ShopCart extends Component {

    render() {
        return (
            <EditableTable/>
        )
    }
}

export default ShopCart;