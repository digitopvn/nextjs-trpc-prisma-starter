import { Layout } from "antd";
import AdminHeader from "./AdminHeader";
import AdminSider from "./AdminSider";
const { Header, Sider, Content } = Layout;
const AdminLayout = (props: any): JSX.Element => {
	return (
		<>
			<Layout>
				<AdminSider></AdminSider>
				<Layout>
					<AdminHeader></AdminHeader>
					<Content style={{ margin: "24px 16px", padding: 24, background: "#fff", height: "88vh" }}>Content</Content>
				</Layout>
			</Layout>
		</>
	);
};

export default AdminLayout;
