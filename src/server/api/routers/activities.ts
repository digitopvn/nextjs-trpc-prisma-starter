import input from "antd/es/input";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";

export const activitiesRouter = createTRPCRouter({
	getAll: protectedProcedure
		.input(
			z.object({
				page: z.number(),
				limit: z.number(),
				orderBy: z.string(),
				order: z.string(),
				search: z.object({
					user: z.string(),
					createdFrom: z.string(),
					createdTo: z.string(),
				}),
			})
		)
		.output((s: any) => {
			console.log("s---->", s);
			return s;
		})
		.query(async ({ ctx, input }) => {
			let orderBy = [];
			if (input.order && input.orderBy) {
				let temp: any = {};
				temp[`${input.orderBy}`] = input.order == "ascend" ? "asc" : "desc";
				orderBy.push(temp);
			}
			let where: any = {};
			if (input.search.createdFrom && input.search.createdTo) {
				where["AND"] = [
					{
						createdAt: {
							gte: new Date(input.search.createdFrom),
						},
					},
					{
						createdAt: {
							lte: new Date(input.search.createdTo),
						},
					},
				];
			}
			if (input.search.user) {
				let users = await ctx.prisma.user.findMany({
					where: {
						name: {
							contains: input.search.user,
						},
					},
				});
				let ids = users.map((user) => user.id);
				where["userId"] = {
					in: ids,
				};
			}
			const [data, total] = await ctx.prisma.$transaction([
				ctx.prisma.activities.findMany({
					orderBy,
					where,
					include: {
						User: {
							select: {
								name: true,
							},
						},
					},
					skip: input.limit * (input.page - 1),
					take: input.limit,
				}),
				ctx.prisma.activities.count(),
			]);
			return {
				data,
				total,
			};
		}),
});
