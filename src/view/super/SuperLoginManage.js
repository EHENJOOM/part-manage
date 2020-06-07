import React, {Component} from 'react';
import EditableContext, {EditableCell} from "../../component/editable";
import MainStyle from "../../main.module.css";
import {Button, Form, Table} from "antd";

class SuperLoginManage extends Component {

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
                </div>
            </EditableContext.Provider>
        );
    }
}

export default SuperLoginManage;