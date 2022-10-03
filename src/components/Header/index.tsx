import styles from "./styles.module.scss"
import Link from "next/link"
import { Button } from "../SignInButton"

const Header = () => {
    
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/logo.svg" alt="Logo" />
                <nav>
                    <Link href={"/"}>Home</Link>
                    <Link href={"/board"}>Meu Board</Link>
                </nav>
                <Button />
            </div>
        </header>
    )
}

export default Header