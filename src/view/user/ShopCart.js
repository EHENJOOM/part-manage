import React, {Component} from 'react';
import {message, Table} from "antd";
import {getCarts} from "../../api";

class ShopCart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            total: 0,
            page: 1,
            pageSize: 5,
            columns: [],
            isLoading: true,
            userName: localStorage.getItem("username"),
            type: localStorage.getItem("type"),
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

    getData = (page, pageSize) => {
        getCarts(this.state.userName, this.state.type, page, pageSize).then(response => {
            console.log(response);
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
        this.getData(current, size);
    }

    // 页切换事件
    change = (page, pageSize) => {
        this.getData(page, pageSize);
        this.setState({page, pageSize});
    }

    componentDidMount() {
        this.getData(this.state.page, this.state.pageSize);
    }
}

export default ShopCart;