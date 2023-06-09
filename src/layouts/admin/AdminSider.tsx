import { Layout } from "antd";
const { Sider } = Layout;
const AdminSider = (props: any): JSX.Element => {
	return (
		<Sider trigger={null} collapsible collapsed={true}>
			<div className="logo" />
		</Sider>
	);
};

export default AdminSider;
