import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { schema } from "./sanity/schemaTypes";
import { structure,defaultDocumentNode } from "./sanity/structure";
import { presentationTool } from "sanity/presentation";
import { stockReportTool } from "./sanity/views/stockReportTool";
import { useOrderActions } from "./sanity/orderActions";
import { ordersSummaryTool } from "./sanity/views/ordersSummaryTool";


export default defineConfig({
  basePath: "/admin/studio",
  projectId: "vxrs2vrl",
  dataset: "production",
  schema,
   document: {
    actions: useOrderActions,
  },
  plugins: [
    deskTool({ structure,defaultDocumentNode }), // ✅ custom order dashboard
     stockReportTool(), // ✅ add the stock report tool
     ordersSummaryTool(), // ✅ add the orders summary tool
    // visionTool({
    //   defaultApiVersion: process.env.VITE_SANITY_API_VERSION || "2024-11-09",
    // }),
    // presentationTool({
    //   previewUrl: {
    //     preview: "/",
    //     previewMode: {
    //       enable: "/draft-mode/enable",
    //     },
    //   },
    // }),
  ],
});
