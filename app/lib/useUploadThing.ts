import { generateReactHelpers } from "@uploadthing/react/hooks";
 
import type { OurFileRouter } from "@/app/lib/uploadThingCore";
 
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();