import { NextPage } from "next"
import Head from "next/head"
import styles from "../styles/styles.module.scss"

const Home: NextPage = () => {
  return (
    <>
     <Head>
        <title>Board - Home</title>
      </Head>
      <main className={styles.contentContainer}>

        <img src="/images/board-user.svg" alt="Board-user" />

        <section className={styles.callToAction}>
          <h1>Uma ferramenta para o seu dia a dia. Escreva, planeje e organize-se</h1>
          <p>
            <span>100% Gratuita</span> e online
          </p>
        </section>

        <div className={styles.donaters}>
          <img src="" alt="" />
        </div>

      </main>
    </>
  )
}

export default Home
