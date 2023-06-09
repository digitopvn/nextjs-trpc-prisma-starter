import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification } from "antd";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth/next";
import { getProviders, signIn } from "next-auth/react";
import { useState } from "react";
import { authOptions } from "~/server/auth";
import { useRouter } from "next/router";

export default function SignIn({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [userInfo, setUserInfo] = useState({ email: "", password: "" });
	const router = useRouter();

	const onSubmit = async (e: any) => {
		let res = await signIn("credentials", { ...userInfo, redirect: false, screen: 'admin' });
		if (!res?.error) {
			notification.success({ message: "Đăng nhập thành công", duration: 2 });
			router.push("/admin/dashboard");
		} else notification.error({ message: "Đăng nhập không thành công", duration: 2 });
	};

	return (
		<div className="flex h-[100vh] w-full items-center justify-center bg-gray-100">
			<Form
				name="normal_login"
				className="login-form w-[90%] rounded-md bg-white p-5 text-center shadow-sm md:w-[50%] lg:w-[35%]"
				onFinish={onSubmit}
			>
				<h2 className="text-xl font-bold">Đăng nhập hệ thống</h2>
				<Form.Item name="email" rules={[{ required: true, message: "Please input your email!" }]}>
					<Input
						prefix={<UserOutlined className="site-form-item-icon" />}
						placeholder="email"
						onChange={(e) =>
							setUserInfo({
								...userInfo,
								email: e.target.value,
							})
						}
					/>
				</Form.Item>
				<Form.Item name="password" rules={[{ required: true, message: "Please input your Password!" }]}>
					<Input
						prefix={<LockOutlined className="site-form-item-icon" />}
						type="password"
						placeholder="Password"
						onChange={(e) =>
							setUserInfo({
								...userInfo,
								password: e.target.value,
							})
						}
					/>
				</Form.Item>
				<Form.Item>
					<Button htmlType="submit" className="w-full bg-[#1890ff] text-white hover:bg-white  hover:text-[#1890ff]">
						Log in
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const session = await getServerSession(context.req, context.res, authOptions);

	if (session) {
		return { redirect: { destination: "/admin/dashboard" } };
	}

	const providers = await getProviders();

	return {
		props: { providers: providers ?? [] },
	};
}
