/** @type {import("next").NextConfig} */
const nextConfig = {}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  output: 'export',
})

module.exports = {
  ...withBundleAnalyzer(nextConfig),
  output: 'export',
}

// if you want to serve WEB with node, use webpack instead
// const withTM = require("next-transpile-modules")(["echarts", "zrender"]);
//
// module.exports = withTM({})
