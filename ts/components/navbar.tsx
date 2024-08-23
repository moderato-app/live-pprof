import { Navbar as NextUINavbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/navbar'
import { Link } from '@nextui-org/link'
import NextLink from 'next/link'

import { siteConfig } from '@/config/site'
import { ThemeSwitch } from '@/components/theme-switch'
import { GithubIcon } from '@/components/icons'
import { SmoothSwitch } from '@/components/smooth-switch'
import { MockSwitch } from '@/components/mock-switch'
import { RecorderButton } from '@/components/recorder-button'
import { RecorderTime } from '@/components/recorder-time'
import { HomeMenu } from '@/components/home-menu'
import UrlBar from '@/components/url-bar'

export const Navbar = () => {
  return (
    <NextUINavbar className={'h-10'} maxWidth="full" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <p className="font-bold text-inherit">Live pprof</p>
          </NextLink>
        </NavbarBrand>
        <ul className="flex justify-center items-center gap-1">
          <UrlBar />
          <RecorderButton />
          <RecorderTime />
          <HomeMenu />
        </ul>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="hidden sm:flex gap-2">
          <MockSwitch />
          <SmoothSwitch />
          <ThemeSwitch />
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  )
}
