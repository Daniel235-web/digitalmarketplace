import { buildConfig } from "payload/config";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import {mongooseAdapter} from "@payloadcms/db-mongodb"
import { slateEditor } from "@payloadcms/richtext-slate";
import path from "path";
import { Users } from "./collections/Users";
import dotenv from 'dotenv';
import { Products } from "./collections/Products/Products";
import { Media } from "./collections/Media";

dotenv.config({
  path: path.resolve(__dirname, '../.env'),// load evironment variable from env file
})
// build the default configuration for the app
export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",// the url of the server the app connects to
  collections: [Users, Products, Media],// The list of collections used by the app
  routes: {
    admin: "/sell",// route to the admin page
  },
  admin: {
    user: "users",// the collections representing the users
    bundler: webpackBundler(),// the bundler used to build the admin page i.e pack things in one page
    meta: {
      titleSuffix: "- Digitalmarket",// The suffix added to the title of the admin interface
      favicon: "/favicon.ico",// The favicon of the admin interface
      ogImage: "/thumbnail.jpg",// The open graph image of the admin interface
    },
  },
  rateLimit: {
    max: 2000,// The maximum number of request per interval
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGODB_URL!,// The url of the mongodb database
  }),
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),// The output File for the generated Typescript types
  },
});