import React, {Component} from 'react';
import {Divider} from "antd";

class OrderDetail extends Component {
    render() {
        return (
            <div>
                <Divider orientation={'left'}>订单信息</Divider>
                <Divider orientation={'left'}>用户信息</Divider>
                <Divider orientation={'left'}>订单信息</Divider>
            </div>
        );
    }
}

export default OrderDetail;