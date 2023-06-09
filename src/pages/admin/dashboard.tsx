import AdminLayout from "~/layouts/admin/AdminLayout";
import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";

const Dashboard: NextPageWithLayout = () => {
	return <p>Dashboard</p>;
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
	return <AdminLayout>{page}</AdminLayout>;
};

export default Dashboard;
