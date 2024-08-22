export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'Live pprof',
  description: 'Monitor Go processes in real-time, launching in 1 second, not all day',
  navItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'About',
      href: '/about',
    },
  ],
  links: {
    github: 'https://github.com/moderato-app/live-pprof',
  },
}
