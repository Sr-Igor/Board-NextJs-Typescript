import styles from "./styles.module.scss"
import { FaGithub } from "react-icons/fa"
import { FiX } from "react-icons/fi"

export const Button = () => {

    const section = false

    return  section ?(
        <button
            type="button"
            className={styles.signInButton}
            onClick={()=>{}}
        >
            <img/>
            Olá xxxxx
            <FiX color={"#737388"} className={styles.closeIcon}/>
        </button>
    ): (
        <button
        type="button"
        className={styles.signInButton}
        onClick={()=>{}}
            >
            <FaGithub color="#eba417"/>
            Entrar com Github
        </button>
    )
}