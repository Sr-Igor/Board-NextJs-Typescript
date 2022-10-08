import { GetServerSideProps, NextPage } from "next"
import { getSession } from "next-auth/react"
import Head from "next/head"
import styles from "../styles/styles.module.scss"
import { getFirestore, collection, query, where,  doc, getDoc, getDocs } from "firebase/firestore"
import { firebaseApp } from "../services/firebase"

// type Props = {
//     items: string
// }

type User ={
    name: string;
    email: string;
    image: string;
    donate: boolean;
    lastDonate: string;
}

const Home: NextPage = ({items}: any) => {
    items = JSON.parse(items) as User[]

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
          {items.map((item: User) => (
            <img src={item.image} alt="" />
          ))}
        </div>

      </main>
    </>
  )
}

export const getStaticProps: GetServerSideProps = async (ctx) => {

  const firebaseDB = getFirestore(firebaseApp)
  const users = query(collection(firebaseDB, 'users'))
  let data = await getDocs(users)
  let items = data.docs.map((doc) => {
      return {
          ...doc.data()
      }
  })

  return{
    props: {
      items: JSON.stringify(items)
    },
    revalidate: 60 * 60 // 1 hour
  }
}

export default Home
