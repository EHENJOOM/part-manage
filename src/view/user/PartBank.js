import React, {Component} from 'react';
import {Button, message, Table, Tag, Tooltip} from "antd";
import {getPart} from "../../api";
import Config from "../../config/Config";

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
                    columns={this.state.columns}
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
            this.setState({total: response.total});
            if (response.code === Config.OK) {
                var res = [];
                for (let i = 0, length = response.data.length; i < length; i++) {
                    var temp = {
                        id: response.data[i]['id'],
                        code: response.data[i]['code'],
                        name: response.data[i]['name'],
                        count: response.data[i]['count'],
                        price: response.data[i]['price']
                    }
                    res.push(temp);
                }
                var keys = Object.keys(res[0]);
                var columns = keys.map(item => {
                    if (item === 'count') {
                        return {
                            title: mapFieldToChinese[item],
                            dataIndex: item,
                            key: item,
                            render: (text, record, index) => {
                                return (
                                    <Tooltip title={record.count >= 50 ? "库存量高于50" : "库存量低于50"}>
                                        <Tag color={record.count >= 50 ? "green" : "red"}>{record.count}</Tag>
                                    </Tooltip>
                                )
                            }
                        }
                    }
                    return {
                        title: mapFieldToChinese[item],
                        dataIndex: item,
                        key: item
                    }
                });
                columns.push({
                    title: '操作',
                    dataIndex: 'action',
                    key: 'action',
                    render: (text, record, index) => {
                        return <Button onClick={this.addIntoCart.bind(this, record)}>加入购物车</Button>
                    }
                });
                this.setState({
                    dataSource: res,
                    columns
                });
            } else if (response.code === Config.SERVER_ERROR) {
                message.error("服务器故障！故障码：" + response.code);
            }
        }).catch(error => {
            message.error("数据异常！");
            console.log(error);
        }).finally(() => {
            this.setState({isLoading: false});
        })
    }

    addIntoCart = record => {

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
}

const mapFieldToChinese = {
    id: "序号",
    code: "零件代码",
    name: "名称",
    count: "库存量",
    price: "单价"
}

export default PartBank;