import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Image
              src="/vercel.svg"
              alt="foo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            ></Image>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
