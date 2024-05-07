/** @type {import('next').NextConfig} */
//new
require("dotenv").config();

//new
const { parsed: localEnv } = require("dotenv").config({
  path: ".env",
});
//endNew

const nextConfig = {
  reactStrictMode: true,
  //new
  env: {
    API_URL: localEnv.API_URL,
    OPENCAGE_API_KEY: localEnv.OPENCAGE_API_KEY,
  },
  i18n: {
    locales: ["en-US", "am-ET"],
    defaultLocale: "en-US",
  },

  images:{
    domains: ['firebasestorage.googleapis.com'],
  }

  //endNew
};

module.exports = nextConfig;
