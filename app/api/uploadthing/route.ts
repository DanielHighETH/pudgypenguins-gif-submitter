import { createNextRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/app/lib/uploadThingCore";
 
export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
});