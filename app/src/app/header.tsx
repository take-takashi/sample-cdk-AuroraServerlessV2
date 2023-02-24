"use client";

import { AppBar, Box } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

type Page = {
  title: string;
  url: string;
};

export default function Header() {
  const links: Page[] = [{ title: "About", url: "/about" }];

  return (
    <header>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Box sx={{ display: "flex" }}>
            {/* logo */}
            <Link href="/">
              <Image
                src="/vercel.svg"
                alt="foo"
                className={styles.vercelLogo}
                width={100}
                height={24}
                priority
              ></Image>
            </Link>

            {/* links分のリンクを展開 */}
            {links.map((link) => (
              <Link key={link.title} href={link.url}>
                {link.title}
              </Link>
            ))}
          </Box>
        </AppBar>
      </Box>
    </header>
  );
}
