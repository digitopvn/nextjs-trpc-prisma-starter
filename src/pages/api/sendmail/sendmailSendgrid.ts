const sgMail = require("@sendgrid/mail");

export const sendMailSendgridCustomer = (data: { mailTo: string | null; customer: any }) => {
	console.log("data.customer::", data.customer);
	let status = transformCustomerStatus(data.customer?.statusProcess);
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);
	const email = process.env.SENDGRID_EMAIL_SEND;
	const msg = {
		to: data.mailTo,
		from: {
			email,
			name: process.env.SENDGRID_TEMPLATE_SEND_NAME,
		},
		templateId: process.env.SENDGRID_TEMPLATE_STATUS_ORDER,
		dynamic_template_data: {
			customerName: data.customer.name,
			phone: data.customer.phone,
			status: status,
			category: data.customer?.category,
		},
	};
	try {
		sgMail.send(msg);
	} catch (error: any) {
		console.log(error);

		if (error.response) {
			console.error(error.response.body);
		}
	}
	return true;
};

export const transformCustomerStatus = (status: number) => {
	let statusString = "";
	switch (status) {
		case 10:
			statusString = "Đơn hàng của bạn đã được tạo thành công";
			break;
		case 20:
			statusString = "Đơn hàng của bạn đã được xác nhận";
			break;
		case 30:
			statusString = "Đơn hàng của bạn đã được chuyển sang trạng thái Chờ chuyển tiền";
			break;
		case 40:
			statusString = "Đơn hàng của bạn đã được chuyển sang trạng thái Đang thực hiện";
			break;
		case 50:
			statusString = "Đơn hàng của bạn đã được chuyển sang trạng thái Đã bàn giao";
			break;
		default:
			break;
	}
	return statusString;
};
