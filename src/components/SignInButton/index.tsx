import styles from "./styles.module.scss"
import { FaGithub } from "react-icons/fa"
import { FiX } from "react-icons/fi"
import { signIn, signOut, useSession } from "next-auth/react"
export const Button = () => {
    const {data} = useSession()
    console.log(data)

    return  data ?(
        <button
            type="button"
            className={styles.signInButton}
            onClick={()=>signOut()}
        >   
            {data?.user?.image && <img src={data.user.image} />}
            Olá {data?.user?.name}
            <FiX color={"#737388"} className={styles.closeIcon}/>
        </button>
    ): (
        <button
        type="button"
        className={styles.signInButton}
        onClick={()=>signIn('github')}
            >
            <FaGithub color="#eba417"/>
            Entrar com Github
        </button>
    )
}