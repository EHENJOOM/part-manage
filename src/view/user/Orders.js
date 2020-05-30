import React, {Component} from 'react';
import {message, Table} from "antd";
import {getOrders} from "../../api";

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
        getOrders(this.state.lid, page, pageSize).then(response => {

        }).catch(error => {
            message.error("未知异常！");
        }).finally(() => {
            this.setState({isLoading: false});
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
}

export default Orders;