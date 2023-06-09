import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import * as bcrypt from "bcrypt";
import { sendMailSendgridCustomer } from "~/pages/api/sendmail/sendmailSendgrid";

export const customerRouter = createTRPCRouter({
	getAll: publicProcedure.query(({ ctx }) => {
		return ctx.prisma.customer.findMany();
	}),

	create: publicProcedure
		.input(
			z
				.object({
					name: z.string(),
					email: z.string(),
					phone: z.string(),
					uploadLink: z.string(),
					category: z.string(),
					message: z.string(),
					statusProcess: z.number(),
				})
				.refine(
					({ name, email, phone, category, message, statusProcess }) =>
						name || email || phone || category || message || statusProcess || { message: "Thông tin chưa chính xác" }
				)
		)
		.mutation(async ({ ctx, input }) => {
			console.log("Mutation", input.uploadLink);
			console.log("Mutation caet", input.category);
			const uploadFile = input.uploadLink;
			const customer = await ctx.prisma.customer.create({
				data: {
					name: input.name,
					email: input.email,
					phone: input.phone,
					uploadLink: uploadFile,
					category: input.category,
					message: input.message,
					statusProcess: input.statusProcess,
				},
			});
			// check file and upload
			// if (uploadFile) {
			// 	// for (const upload of uploadFile) {
			// 	// 	const uuidV4 = uuid();
			// 	// 	const name = uuidV4 + "." + upload.ext;

			// 	// }
			// 	await saveFile(subscription);
			// }
			if (customer) {
				sendMailSendgridCustomer({ mailTo: customer.email, customer: customer });
			}
			return customer;
		}),
	update: publicProcedure
		.input(
			z
				.object({
					id: z.string(),
					name: z.string(),
					email: z.string(),
					phone: z.string(),
					uploadLink: z.string(),
					category: z.string(),
					message: z.string(),
					statusProcess: z.number(),
				})
				.refine(
					({ id, name, email, phone, category, message, statusProcess }) =>
						id || name || email || phone || category || message || statusProcess || { message: "Thông tin chưa chính xác" }
				)
		)
		.mutation(async ({ ctx, input }) => {
			const uploadFile = input.uploadLink;
			const customer = await ctx.prisma.customer.update({
				where: { id: input.id },
				data: {
					name: input.name,
					email: input.email,
					phone: input.phone,
					uploadLink: uploadFile,
					category: input.category,
					message: input.message,
					statusProcess: input.statusProcess,
				},
			});
			if (customer) {
				sendMailSendgridCustomer({ mailTo: customer.email, customer: customer });
			}

			return customer;
		}),
	delete: publicProcedure
		.input(
			z.object({
				id: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const customer = await ctx.prisma.customer.delete({
				where: {
					id: input.id,
				},
			});

			return customer;
		}),
});
