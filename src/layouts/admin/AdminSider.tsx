import { Layout, Menu } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { getAdminMenu } from "~/contants/menu";
const { Sider } = Layout;
const AdminSider = (props: any): JSX.Element => {
	const session = useSession();
	const user = session?.data?.user;
	const menu = getAdminMenu(user);
	const router = useRouter();

	return (
		<Sider trigger={null} collapsible collapsed={props.collapsed} theme="light">
			<div >
				<img className="block mx-auto" width={80} height={80} src="https://cdn.pixabay.com/photo/2020/08/05/13/11/eco-5465425_1280.png"></img>
			</div>
			<Menu  
				defaultSelectedKeys={["dashboard"]} 
				mode="inline" 
				theme="light" 
				items={menu} 
				onClick={(e) => router.push(`/admin/${e.key}`)}
			/>
		</Sider>
	);
};

export default AdminSider;
