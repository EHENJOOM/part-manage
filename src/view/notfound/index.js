import React, {Component} from 'react';
import { Result } from "antd";

class NotFound extends Component {
    render() {
        return (
            <Result title={"404"} status={"404"} subTitle={"啊噢，页面好像不见了~"}/>
        );
    }
}

export default NotFound;