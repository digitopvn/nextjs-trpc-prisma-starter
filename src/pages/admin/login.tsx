import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Form, Input, Checkbox, Button, notification } from "antd";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";

const Login = (props: any): JSX.Element => {
	const [userInfo, setUserInfo] = useState({ email: "", password: "" });
	const router = useRouter();
	// const { mutate, isLoading: isPosting } = api.user.create.useMutation({
	// 	onSuccess: () => {
	// 		notification.success({ message: "Gửi thông tin thành công!" });
	// 	},
	// 	onError: (e: any) => {
	// 		notification.error({ message: `Gửi thông tin thất bại!` });
	// 	},
	// });

	const onSubmit = async (e: any) => {
		// mutate({
		// 	name: "Thịnh Nguyễn",
		// 	email: "thinhdev@gmail.com",
		// 	password: "Top@123#"
		// });
		let res = await signIn("credentials", {
			...userInfo,
			redirect: false,
		});
		if (!res?.error) {
			notification.success({
				message: "Thành công rồi mừng quá",
				duration: 3,
			});
			router.push("/admin/customers");
		} else
			notification.error({
				message: res?.error,
				duration: 3,
			});
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
				<a className="login-form-forgot" href="#">
					Forgot password
				</a>
			</Form>
		</div>
	);
};

export default Login;
