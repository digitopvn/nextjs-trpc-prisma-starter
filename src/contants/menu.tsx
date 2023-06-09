import { PieChartOutlined } from "@ant-design/icons";

export const getAdminMenu = (user: any) => {
	let menu = [
		{
			label: "Dashboard",
			icon: <PieChartOutlined />,
			key: "dashboard",
		},
		{
			label: "Customer",
			icon: <PieChartOutlined />,
			key: "customer-parent",
			children: [
				{
					label: "Danh Sách",
					key: "customers",
				},
			],
		},
	];
    return menu;
};
