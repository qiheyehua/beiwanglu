"use client";

import { useState } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarButton,
} from "@/components/ui/resizable-navbar";

const navItems = [
  {
    name: "知识点",
    link: "/",
  },
  {
    name: "今日复习",
    link: "/review",
  },
];

// 自定义Logo组件
const AppLogo = () => {
  return (
    <a
      href="/"
      className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full text-black">
      <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-alphabet-bangla"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 12c.904 -.027 3 2 3 7" /><path d="M10 11c0 -.955 0 -2 .786 -2.677c1.262 -1.089 3.025 .55 3.2 2.06c.086 .741 -.215 3.109 -1.489 4.527c-.475 .53 -.904 .992 -1.711 1.074c-.75 .076 -1.364 -.122 -2.076 -.588c-1.138 -.743 -2.327 -1.997 -3.336 -3.73c-1.078 -1.849 -1.66 -3.113 -2.374 -5.666" /><path d="M7.37 7.072c.769 -.836 5.246 -4.094 8.4 -.202c.382 .472 .573 .708 .9 1.63c.326 .921 .326 1.562 .326 2.844v7.656" /><path d="M17 10c0 -1.989 1.5 -4 4 -4" /></svg>
      </div>
      <span className="font-medium text-black dark:text-white">七禾页话的备忘录</span>
    </a>
  );
};

export default function MainNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <Navbar className="top-0">
        <NavBody>
          <AppLogo />
          <NavItems items={navItems} />
          <div className="relative z-20 flex items-center justify-end">
            <NavbarButton href="/api/init" variant="secondary">
              初始化数据库
            </NavbarButton>
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <AppLogo />
            <MobileNavToggle
              isOpen={mobileMenuOpen}
              onClick={toggleMobileMenu}
            />
          </MobileNavHeader>
          <MobileNavMenu isOpen={mobileMenuOpen} onClose={toggleMobileMenu}>
            {navItems.map((item, i) => (
              <a
                key={i}
                href={item.link}
                className="w-full rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <NavbarButton
              href="/api/init"
              className="mt-4 w-full"
              variant="secondary"
            >
              初始化数据库
            </NavbarButton>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </>
  );
} 