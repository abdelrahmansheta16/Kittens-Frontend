import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../../styles/Navbar.module.css";
import Link from "next/link"; // Import Link component from Next.js

export default function Navbar() {
	return (
		<nav className={styles.navbar}>
			<a href="/" className={styles.title}>
				Kitties
			</a>
			<div className={styles.tabs}>
				<Link href="/" className={styles.tabs}>Home</Link>
				<Link href="/mykitties" className={styles.tabs}>My kitties</Link>
				<Link href="/kfactory" className={styles.tabs}>K-Factory</Link>
			</div>
			<ConnectButton></ConnectButton>
		</nav>
	);
}
