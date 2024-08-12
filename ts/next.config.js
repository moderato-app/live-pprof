/** @type {import("next").NextConfig} */
const nextConfig = {}
const withTM = require('next-transpile-modules')(['echarts', 'zrender'])

module.exports = withTM({
  output: 'export',
})
