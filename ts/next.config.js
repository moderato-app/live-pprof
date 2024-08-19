/** @type {import("next").NextConfig} */
const nextConfig = {}

module.exports = {
  output: 'export',
}

// if you want to serve WEB with node, use webpack instead
// const withTM = require("next-transpile-modules")(["echarts", "zrender"]);
//
// module.exports = withTM({})
