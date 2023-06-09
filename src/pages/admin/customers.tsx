import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Form, Input, Popconfirm, Row, Select, Space, Table, Tag, notification } from "antd";
import NextNProgress from "nextjs-progressbar";
import { ReactElement, useState } from "react";
import AdminLayout from "~/layouts/admin/AdminLayout";
import { api } from "~/utils/api";
import { NextPageWithLayout } from "../_app";
const { TextArea } = Input;
const { Option } = Select;

type DrawerProps = {
	open: boolean;
	onCloseDrawer: Function;
	onSave: Function;
	roles: any;
};

const Customers: NextPageWithLayout = () => {
	const [form] = Form.useForm();

	const { data, refetch } = api.customer.getAll.useQuery();
	const [type, setType] = useState("Tạo mới");
	const [dataEdit, setDataEdit] = useState({
		name: "",
		email: "",
		phone: "",
		message: "",
		statusProcess: "",
		category: "",
		uploadLink: "",
		id: "",
	});

	const { mutate: createCustomer } = api.customer.create.useMutation({
		onSuccess: () => {
			notification.success({ message: "Tạo thông tin thành công!" });
			refetch();
			form.resetFields();
			onClose();
		},
		onError: (e: any) => {
			notification.error({ message: `Tạo thông tin thất bại!` });
		},
	});

	const { mutate: editCustomer } = api.customer.update.useMutation({
		onSuccess: () => {
			notification.success({ message: "Cập nhật thông tin thành công!" });
			refetch();
			onCloseEdit();
			form.resetFields();
		},
		onError: (e: any) => {
			notification.error({ message: `Cập nhật thông tin thất bại!` });
		},
	});

	const { mutate: deleteCustomer } = api.customer.delete.useMutation({
		onSuccess: () => {
			notification.success({ message: "Xoá thành công!" });
			refetch();
		},
		onError: (e: any) => {
			notification.error({ message: `Xoá thất bại!` });
		},
	});
	const confirmDelete = (id: string) => {
		deleteCustomer({ id });
	};

	const columns = [
		{
			title: "Tên",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
		{
			title: "SĐT",
			dataIndex: "phone",
			key: "phone",
		},
		{
			title: "Trạng thái",
			dataIndex: "statusProcess",
			key: "statusProcess",
			render: (statusProcess: number) => (
				<div>
					{statusProcess == 10 && <Tag color="green">Khách hàng mới</Tag>}
					{statusProcess == 20 && <Tag color="blue">Đã xác nhận</Tag>}
					{statusProcess == 30 && <Tag color="volcano">Chờ chuyển tiền</Tag>}
					{statusProcess == 40 && <Tag color="black">Đang thực hiện</Tag>}
					{statusProcess == 50 && <Tag color="pink">Đã bàn giao</Tag>}
				</div>
			),
		},
		{
			title: "Hành động",
			key: "action",
			render: (row: any) => (
				<Space size="middle">
					<Button type="primary" icon={<EditOutlined />} onClick={() => showDrawerEdit(row)}>
						Sửa
					</Button>
					<Popconfirm
						title="Xoá khách hàng"
						description="Bạn có chắc muốn xoá khách hàng?"
						onConfirm={() => confirmDelete(row.id)}
						okText="Yes"
						cancelText="No"
					>
						<Button danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const [open, setOpen] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);

	const showDrawer = () => {
		setOpen(true);
	};

	const showDrawerEdit = (data: any) => {
		const categorySplit = data.category.split(",");
		setDataEdit({
			id: data.id,
			name: data.name,
			email: data.email,
			phone: data.phone,
			statusProcess: data.statusProcess + "",
			message: data.message,
			category: categorySplit,
			uploadLink: data.uploadLink,
		});

		form.setFieldsValue({
			name: data.name,
			email: data.email,
			phone: data.phone,
			statusProcess: data.statusProcess + "",
			message: data.message,
			category: [...data.category.split(",")],
		});
		setOpenEdit(true);
	};
	const handleSubmit = async (data: any) => {
		createCustomer({
			...data,
			category: data.category.toString(),
			statusProcess: Number(data.statusProcess),
		});
	};

	const handleEditSubmit = async (data: any) => {
		editCustomer({
			...data,
			id: dataEdit.id,
			category: data.category.toString(),
			statusProcess: Number(data.statusProcess),
		});
	};

	const onClose = () => {
		setOpen(false);
		form.resetFields();
	};

	const onCloseEdit = () => {
		setOpenEdit(false);
		form.resetFields();
	};
	return (
		<>
			<NextNProgress color="#1677ff" height={2} />
			<div className="pt-6">
				<div className="filter-group pb-4">
					<div className="action-group flex justify-end">
						<Space wrap>
							<Button type="primary" icon={<PlusOutlined />} onClick={() => showDrawer()}>
								Thêm khách hàng
							</Button>
						</Space>
					</div>
				</div>
				<Table columns={columns} dataSource={data} rowKey={(data: any) => data.id} bordered />
			</div>
			<Drawer
				title="Tạo khách hàng"
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
				<Form layout="vertical" form={form} id="edit-object-post-form" onFinish={handleSubmit}>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name="uploadLink" label="Link" rules={[{ required: true, message: "Vui lòng nhập link" }]}>
								<Input placeholder="Vui lòng nhập link" />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name="name" label="Tên" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
								<Input placeholder="Vui lòng nhập tên" />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name="email" label="Email" rules={[{ required: true, message: "Vui lòng nhập email" }]}>
								<Input placeholder="Vui lòng nhập email" />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
								<Input placeholder="Vui lòng nhập số điện thoại" />
							</Form.Item>
						</Col>
						{/* <Col span={12}>
                            <Form.Item name="province" label="Tỉnh / Thành phố" rules={[{ required: true, message: "Vui lòng chọn tỉnh / thành phố" }]}>
                                <Select placeholder="Vui lòng chọn tỉnh / thành phố">
                                    <Option key={1} value="private">
                                        Private
                                    </Option>
                                    <Option key={2} value="public">
                                        Public
                                    </Option>
                                </Select>
                            </Form.Item>
                        </Col> */}
						<Col span={12}>
							<Form.Item name="statusProcess" label="Trạng thái khách hàng" rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}>
								<Select placeholder="Please choose the type">
									<Option key={10} value="10">
										Đơn hàng mới
									</Option>
									<Option key={20} value="20">
										Đã xác nhận
									</Option>
									<Option key={30} value="30">
										Chờ chuyển tiền
									</Option>
									<Option key={40} value="40">
										Đang thực hiện
									</Option>
									<Option key={50} value="50">
										Đã bàn giao
									</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name="category" label="Loại dịch vụ" rules={[{ required: true, message: "Vui lòng chọn dịch vụ" }]}>
								<Select placeholder="Please choose the category" mode="multiple">
									<Option key={1} value="Xây dựng kiến trúc">
										Xây dựng kiến trúc
									</Option>
									<Option key={2} value="Tổ chức sự kiện">
										Tổ chức sự kiện
									</Option>
									<Option key={3} value="Bất động sản">
										Bất động sản
									</Option>
									<Option key={4} value="Nghệ thuật">
										Nghệ thuật
									</Option>
									<Option key={5} value="Ẩm thực">
										Ẩm thực
									</Option>
									<Option key={6} value="Startup">
										Startup
									</Option>
									<Option key={7} value="Doanh nghiệp">
										Doanh nghiệp
									</Option>
									<Option key={8} value="Công nghệ">
										Công nghệ
									</Option>
									<Option key={9} value="Quảng cáo">
										Quảng cáo
									</Option>
									<Option key={10} value="Nhiếp ảnh">
										Nhiếp ảnh
									</Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name="message" label="Tin nhắn" rules={[{ required: true, message: "Vui lòng nhập tin nhắn" }]}>
								<TextArea placeholder="Vui lòng nhập tin nhắn"></TextArea>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Drawer>

			<Drawer
				title="Cập nhật khách hàng"
				width={720}
				onClose={onCloseEdit}
				open={openEdit}
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
				<Form layout="vertical" form={form} id="edit-object-post-form" onFinish={handleEditSubmit} initialValues={dataEdit}>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name="uploadLink" label="Link" rules={[{ required: true, message: "Vui lòng nhập link" }]}>
								<Input placeholder="Vui lòng nhập link" />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name="name" label="Tên" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
								<Input placeholder="Vui lòng nhập tên" />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name="email" label="Email" rules={[{ required: true, message: "Vui lòng nhập email" }]}>
								<Input placeholder="Vui lòng nhập email" />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
								<Input placeholder="Vui lòng nhập số điện thoại" />
							</Form.Item>
						</Col>
						{/* <Col span={12}>
                            <Form.Item name="province" label="Tỉnh / Thành phố" rules={[{ required: true, message: "Vui lòng chọn tỉnh / thành phố" }]}>
                                <Select placeholder="Vui lòng chọn tỉnh / thành phố">
                                    <Option key={1} value="private">
                                        Private
                                    </Option>
                                    <Option key={2} value="public">
                                        Public
                                    </Option>
                                </Select>
                            </Form.Item>
                        </Col> */}
						<Col span={12}>
							<Form.Item name="statusProcess" label="Trạng thái khách hàng" rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}>
								<Select placeholder="Please choose the type">
									<Option key={10} value="10">
										Đơn hàng mới
									</Option>
									<Option key={20} value="20">
										Đã xác nhận
									</Option>
									<Option key={30} value="30">
										Chờ chuyển tiền
									</Option>
									<Option key={40} value="40">
										Đang thực hiện
									</Option>
									<Option key={50} value="50">
										Đã bàn giao
									</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name="category" label="Loại dịch vụ" rules={[{ required: true, message: "Vui lòng chọn dịch vụ" }]}>
								<Select placeholder="Please choose the category" mode="multiple">
									<Option key={1} value="Xây dựng kiến trúc">
										Xây dựng kiến trúc
									</Option>
									<Option key={2} value="Tổ chức sự kiện">
										Tổ chức sự kiện
									</Option>
									<Option key={3} value="Bất động sản">
										Bất động sản
									</Option>
									<Option key={4} value="Nghệ thuật">
										Nghệ thuật
									</Option>
									<Option key={5} value="Ẩm thực">
										Ẩm thực
									</Option>
									<Option key={6} value="Startup">
										Startup
									</Option>
									<Option key={7} value="Doanh nghiệp">
										Doanh nghiệp
									</Option>
									<Option key={8} value="Công nghệ">
										Công nghệ
									</Option>
									<Option key={9} value="Quảng cáo">
										Quảng cáo
									</Option>
									<Option key={10} value="Nhiếp ảnh">
										Nhiếp ảnh
									</Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name="message" label="Tin nhắn" rules={[{ required: true, message: "Vui lòng nhập tin nhắn" }]}>
								<TextArea placeholder="Vui lòng nhập tin nhắn"></TextArea>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Drawer>
		</>
	);
};

Customers.getLayout = function getLayout(page: ReactElement) {
	return <AdminLayout>{page}</AdminLayout>;
};

export default Customers;
