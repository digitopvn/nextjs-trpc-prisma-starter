import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { activitiesRouter } from "./routers/activities";
import { customerRouter } from "./routers/customer";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	example: exampleRouter,
	activities: activitiesRouter,
	customer: customerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
