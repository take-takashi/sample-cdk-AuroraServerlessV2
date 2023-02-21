import styles from "./layout.module.css";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.sidebar}>
      <div>Sidebar</div>
      <div>{children}</div>
    </div>
  );
}
