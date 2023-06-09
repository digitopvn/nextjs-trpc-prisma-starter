import { Layout } from "antd";
import { useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSider from "./AdminSider";
import { SessionProvider } from "next-auth/react";
import { api } from "~/utils/api";
const { Content } = Layout;

const AdminLayout = (props: any): JSX.Element => {
	const [collapsed, setCollapsed] = useState(false);	
	return (
		<SessionProvider>
			<Layout>
				<AdminSider collapsed={collapsed}></AdminSider>
				<Layout>
					<AdminHeader collapsed={collapsed} setCollapsed={setCollapsed}></AdminHeader>
					<Content style={{ margin: "24px 16px", padding: 24, background: "#fff", height: "87.7vh" }}>{props.children}</Content>
				</Layout>
			</Layout>
		</SessionProvider>
	);
};

export default api.withTRPC(AdminLayout) as any;
