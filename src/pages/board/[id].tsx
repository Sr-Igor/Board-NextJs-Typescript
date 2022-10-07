import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import { getFirestore, collection, query, where,  doc, getDoc, getDocFromCache } from "firebase/firestore"
import { firebaseApp } from "../../services/firebase"
import { format } from "date-fns"
import styles from "./task.module.scss"
import Head from "next/head"
import {FiCalendar} from 'react-icons/fi'
type Props = {
    data: string
}

type Task = {
    id: string;
    created: string|Date;
    createdFormated: string;
    task: string;
    userEmail: string;
    userName: string;
}

const Task = ({data}: Props) => {
    let task = JSON.parse(data) as Task
    console.log(task)

    return(
        <>
        <Head>
            <title>Detalhes da Tarefa</title>
        </Head>
        <article className={styles.container}>
            <div className={styles.actions}>
                <div>
                    <FiCalendar size={30} color="#FFF"/>
                    <span>Tarefa Criada:</span>
                    <time>{task.createdFormated}</time>
                </div>
            </div>
            <p>{task.task}</p>
        </article>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {
    const id = params?.id
    const session = await getSession({req})

    if(!session){
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const firebaseDB = getFirestore(firebaseApp)
    let docRef = doc(firebaseDB, 'tasks', id as string)
    let docSnap = await getDoc(docRef) as any
    // docSnap = docSnap.data() as any

    const task = {
        id: docSnap.data().id,
        created: docSnap.data().created,
        createdFormated: format(docSnap.data().created.toDate(), 'dd MMMM yyyy'),
        task: docSnap.data().task,
        userEmail: docSnap.data().userEmail,
        userName: docSnap.data().userName
    }

    return{
        props: {
            data: JSON.stringify(task)
        }
    }
}

export default Task