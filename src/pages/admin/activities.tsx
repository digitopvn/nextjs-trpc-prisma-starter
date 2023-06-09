import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Collapse, DatePicker, Drawer, Form, Input, Row, Select, Space, Table } from 'antd';
const { Option } = Select;

import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { TableParams } from "~/model/table.model";
import moment from 'moment';

const { Panel } = Collapse;
const { RangePicker } = DatePicker;

type DrawerProps = {
    open: boolean;
    onCloseDrawer: Function;
    onSave: Function;
    roles: any;
};
const Activities = (props: any): JSX.Element => {
    const [form] = Form.useForm();
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 2,
        },
        field: 'createdAt',
        order: "ascend"
    });
    const [open, setOpen] = useState(false);
    const [searchFormInput, setSearchFormInput] = useState({
        user: '',
        createdFrom: '',
        createdTo: '',
    });

    useEffect(() => {
        refetch()
    }, [searchFormInput])


    const { data, refetch, isLoading } = api.activities.getAll.useQuery({
        page: tableParams.pagination.current,
        limit: tableParams.pagination.pageSize,
        orderBy: tableParams.field || '',
        order: tableParams.order || '',
        search: searchFormInput
    });
    const dataSource: any = data?.data?.map((item: any) => {
        return {
            ...item,
            key: item.id,
            User: item.User?.name,
            createdAt: moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
        }
    })
    const columns = [
        {
            title: "Message",
            dataIndex: "message_vi",
            key: "message",
        },
        {
            title: "Url",
            dataIndex: "url",
            key: "url",
        },
        {
            title: "Aggregate ID",
            dataIndex: "aggregateID",
            key: "aggregateID",
        },
        {
            title: "Method",
            dataIndex: "method",
            key: "method",
            sorter: true,
        },
        {
            title: "User",
            dataIndex: "User",
            key: "User",
        },
        {
            title: "CreatedAt",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: true,
        },
    ];

    const handleTableChange = (
        pagination: any,
        filters: any,
        sorter: any,
    ) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <div className="pt-6">
            <Collapse className="mb-3">
                <Panel header="Bộ lọc tìm kiếm" key="1">
                    <Form
                        layout="vertical"
                        form={form}
                        id="search-form"
                    >
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="user"
                                    label="Tên người dùng"
                                >
                                    <Input placeholder="Vui lòng nhập tên người dùng"
                                        onChange={(e: any) => {
                                            setSearchFormInput({
                                                ...searchFormInput,
                                                user: e.target.value,
                                            })
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={16}>
                                <Form.Item
                                    name="createAt"
                                    label="Ngày tạo"
                                >
                                    <RangePicker showTime className="w-full"
                                        onChange={(e: any) => {
                                            setSearchFormInput({
                                                ...searchFormInput,
                                                createdFrom: moment(e[0].$d).format('YYYY-MM-DD HH:mm:ss'),
                                                createdTo: moment(e[1].$d).format('YYYY-MM-DD HH:mm:ss'),
                                            })
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Space>
                            <Button htmlType="button" type="default"
                                onClick={() => {
                                    setSearchFormInput({
                                        user: '',
                                        createdFrom: '',
                                        createdTo: '',
                                    });
                                    form.resetFields()
                                }}
                            >
                                Làm mới
                            </Button>
                        </Space>
                    </Form>
                </Panel>
            </Collapse>
            <Table columns={columns} dataSource={dataSource} bordered
                onChange={handleTableChange}
                pagination={{
                    ...tableParams.pagination,
                    total: data?.total || 0
                }}
                loading={isLoading}
            />
        </div>
    );
};

export default Activities;
