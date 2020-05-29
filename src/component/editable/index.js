import React, {Component} from 'react';
import {Form, Input, InputNumber} from "antd";

const EditableContext = React.createContext(undefined, undefined);

export class EditableCell extends Component {
    getInput = () => {
        const {inputType} = this.props;
        console.log(this.props);
        if (inputType === 'number') {
            return <InputNumber/>;
        }
        return <Input/>;
    };

    renderCell = () => {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item style={{margin: 0}} name={dataIndex} rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]} initialValue={record[dataIndex]}>
                        {this.getInput()}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
}

export default EditableContext;