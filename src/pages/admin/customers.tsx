import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, Table } from 'antd';
const { Option } = Select;

import { Admin } from "~/templates/Admin";
import { useState } from "react";

type DrawerProps = {
    open: boolean;
    onCloseDrawer: Function;
    onSave: Function;
    roles: any;
};

const Customers = (props: any): JSX.Element => {
    const [form] = Form.useForm();

    const dataSource: any = [
        {
            key: "1",
            name: "Mike",
            age: 32,
            address: "10 Downing Street",
        },
        {
            key: "2",
            name: "John",
            age: 42,
            address: "10 Downing Street",
        },
    ];

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Age",
            dataIndex: "age",
            key: "age",
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
        },
    ];

    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const handleSubmit = async (data: any) => {
        console.log(`123:`, data);
        onClose();
    };

    const onClose = () => {
        setOpen(false);
    };
    return (
        <Admin>
            <div className="pt-6">
                <div className="filter-group pb-4">
                    <div className="action-group flex justify-end">
                        <Space wrap>
                            <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => showDrawer()}>
                                Tạo
                            </Button>
                        </Space>
                    </div>
                </div>
                <Table columns={columns} dataSource={dataSource} bordered />
            </div>
            <Drawer
                title="Tạo tài khoản"
                width={720}
                onClose={onClose}
                open={open}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    <Space>
                        <Button onClick={onClose}>Trở lại</Button>
                        <Button htmlType="submit" type="primary" form="edit-object-post-form">
                            Lưu
                        </Button>
                    </Space>
                }
            >
                <Form
                    layout="vertical"
                    form={form}
                    id="edit-object-post-form"
                    onFinish={handleSubmit}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Tên"
                                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                            >
                                <Input placeholder="Vui lòng nhập tên" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[{ required: true, message: 'Vui lòng nhập email' }]}
                            >
                                <Input placeholder="Vui lòng nhập email" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="phone"
                                label="Số điện thoại"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                            >
                                <Input placeholder="Vui lòng nhập số điện thoại" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="province"
                                label="Tỉnh / Thành phố"
                                rules={[{ required: true, message: 'Vui lòng chọn tỉnh / thành phố' }]}
                            >
                                <Select placeholder="Vui lòng chọn tỉnh / thành phố">
                                    <Option value="private">Private</Option>
                                    <Option value="public">Public</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="district"
                                label="Quận / Huyện"
                                rules={[{ required: true, message: 'Vui lòng chọn Quận / Huyện' }]}
                            >
                                <Select placeholder="Please choose the type">
                                    <Option value="private">Private</Option>
                                    <Option value="public">Public</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="address"
                                label="Địa chỉ"
                                rules={[{ required: true, message: 'Vui lòng nhập số địa chỉ' }]}
                            >
                                <Input placeholder="Vui lòng nhập số địa chỉ" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

            </Drawer>

        </Admin>
    );
};

export default Customers;
