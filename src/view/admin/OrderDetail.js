import React, {Component} from 'react';
import Style from "../style.module.css";
import MainStyle from "../../main.module.css";
import {Button, Tag, Tooltip} from "antd";

class OrderDetail extends Component {

    render() {
        const {param} = this.props.history.location.query;
        return (
            <div className={[Style.paddingLeft16, Style.paddingRight16].join(' ')}>
                <span className={Style.headTitle}>零件信息</span>
                <div className={MainStyle.content}>
                    <span className={Style.spanMargin}>零件代码</span>{param.partCode}<br/>
                    <span className={Style.spanMargin}>零件名称</span>{param.partName}<br/>
                    <span className={Style.spanMargin}>单&emsp;&emsp;价</span><Tag color={param.price < 2000 ? 'green' : 'red'}>{param.price}</Tag><br/>
                    <span className={Style.spanMargin}>数&emsp;&emsp;量</span><Tag color={param.count < 50 ? 'red' : 'green'}>{param.count}</Tag><br/>
                    <span className={Style.spanMargin}>总&nbsp;&nbsp;金&nbsp;&nbsp;额</span><Tag color={param.totalPrice < 5000 ? 'green' : 'red'}>{param.totalPrice}</Tag><br/>
                </div>
                <span className={Style.headTitle}>用户信息</span>
                <div className={MainStyle.content}>
                    <span className={Style.spanMargin}>用户代码</span>{param.userCode}<br/>
                    <span className={Style.spanMargin}>用户姓名</span>{param.userName}<br/>
                    <span className={Style.spanMargin}>性&emsp;&emsp;别</span><Tag color={param.sex === '男' ? 'blue' : 'pink'}>{param.sex}</Tag><br/>
                    <span className={Style.spanMargin}>联系电话</span>{param.phone}<br/>
                    <span className={Style.spanMargin}>地&emsp;&emsp;址</span>{param.address}<br/>
                </div>
                <span className={Style.headTitle}>订单信息</span>
                <div className={MainStyle.content}>
                    <span className={Style.spanMargin}>订单创建日期</span>{param.buildTime}<br/>
                    <span className={Style.spanMargin}>最晚支付日期</span>{param.latestTime}<br/>
                    <span className={Style.spanMargin}>支&nbsp;&nbsp;付&nbsp;&nbsp;日&nbsp;&nbsp;期&nbsp;</span>{param.payTime}<br/>
                    <span className={Style.spanMargin}>订&nbsp;&nbsp;单&nbsp;&nbsp;状&nbsp;&nbsp;态&nbsp;</span>{param.status}<br/>
                    <span className={Style.spanMargin}>备&emsp;&emsp;&emsp;&emsp;注</span>
                        {param.extend}
                        <Button type={'link'}>编辑</Button>
                        <br/>
                    <span className={Style.spanMargin}>平均欠款时间</span>
                        <Tooltip
                            color={param.aat < 3 ? 'green' : param.aat < 5 ? 'blue' : param.aat < 7 ? 'yellow' : param.aat < 10 ? 'orange' : 'red'}
                            title={'信用' + (param.aat < 3 ? '非常好' : param.aat < 5 ? '良好' : param.aat < 7 ? '一般' : param.aat < 10 ? '差' : '非常差')}
                        >
                            <Tag color={param.aat < 3 ? 'success' : param.aat < 5 ? 'processing' : param.aat < 7 ? 'gold' : param.aat < 10 ? 'warning' : 'error'}>{param.aat + '天'}</Tag>
                        </Tooltip>
                        <br/>
                </div>
                <span className={Style.headTitle}>操作</span>
                <div className={MainStyle.content}>
                    <div className={Style.right}>
                        <Button type={'primary'} onClick={this.accept.bind(this, param)} className={Style.marginRight20}>接受</Button>
                        <Button onClick={this.deliver.bind(this, param)} className={Style.marginRight20}>发货</Button>
                        <Button onClick={this.refuse.bind(this, param)} className={Style.marginRight20} danger>拒绝</Button>
                    </div>
                </div>
            </div>
        );
    }

    accept = param => {

    }

    deliver = param => {

    }

    refuse = param => {

    }
}

export default OrderDetail;