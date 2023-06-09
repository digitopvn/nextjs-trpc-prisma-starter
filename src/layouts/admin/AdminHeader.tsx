import { DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Layout, Popover, Row, Space } from "antd";
import { signOut, useSession } from "next-auth/react";
const { Header } = Layout;
const AdminHeader = (props: any): JSX.Element => {
	const session = useSession();
	const user = session?.data?.user;

	return (
		<Header
			className="p-0 bg-white"
		>
			<Row>
				<Col span={21}>
					<Button
						type="text"
						icon={props.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
						onClick={() => props.setCollapsed(!props.collapsed)}
						style={{
							fontSize: "16px",
							width: 64,
							height: 64,
						}}
					/>
				</Col>
				<Col span={3}>
					<Popover
						placement="bottomLeft"
						trigger="click"
						content={
							<Space direction="vertical">
								<Space.Compact direction="vertical" className="w-full">
									<Button href="/account">Profile</Button>
									<Button onClick={() => signOut({ redirect: true, callbackUrl: "/admin/login" })}>Sign out</Button>
								</Space.Compact>
							</Space>
						}
					>
						<div className="cursor-pointer align-middle">
							<Avatar style={{ lineHeight: "20px" }} icon={<UserOutlined style={{ verticalAlign: "middle" }} />} size={24} />
							<span className="ml-2 inline-block">{user?.name}</span>
							<DownOutlined className="ml-2" />
						</div>
					</Popover>
				</Col>
			</Row>
		</Header>
	);
};

export default AdminHeader;
