import styles from "./styles.module.scss"
import Head from "next/head"
import { FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock } from "react-icons/fi"
import { DonateButtton } from "../../components/DonateButton"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import { useState, FormEvent } from "react"
import { firebaseApp } from "../../services/firebase"
import { getFirestore, getDocs, collection, addDoc, query, where, deleteDoc, doc } from "firebase/firestore"
import { format } from "date-fns"
import Link from "next/link"


type Task = {
    id: string;
    created: string|Date;
    createdFormated: string;
    task: string;
    userEmail: string;
    userName: string;
}
interface Props {
    user: {
        name: string;
        email: string;
        image: string;
    },
    data: string
}

function Board({user, data}: Props) {
    const [input, setInput] = useState('')
    const [taskList, setTaskList] = useState<Task[]>(JSON.parse(data))

    const handleAddTask = async (e: FormEvent) => {
        e.preventDefault()

        if(!input.trim()){
            return
        }
        const firebaseDB = getFirestore(firebaseApp)
        const tasks = collection(firebaseDB, 'tasks')
        await addDoc(tasks, {
            created: new Date(),
            task: input,
            userEmail: user.email,
            userName: user.name,
        }).then((doc) => {
            let data ={
                id: doc.id,
                created: new Date(),
                createdFormated: format(new Date(), 'dd MMMM yyyy'),
                task: input,
                userEmail: user.email,
                userName: user.name,
            }
            setTaskList([...taskList, data])
            setInput('')
        })
        .catch((error: any) => {
            console.log("error", error)
        })
    }

    const handleDelete = async (id: string) => {
        const firebaseDB = getFirestore(firebaseApp)
        const tasks = collection(firebaseDB, 'tasks')
        await deleteDoc(doc(tasks, id))
        let newList = taskList.filter((item) => item.id !== id)
        setTaskList(newList)
    }

    return(
        <>
        <Head>
            <title>Minhas Tarefas - Board</title>
        </Head>
        <main className={styles.container}>
            <form onSubmit={handleAddTask}>
                <input 
                    type={"text"}
                    placeholder={"Digite sua tarefa..."}
                    value={input}
                    onChange={(e)=>setInput(e.target.value)}
                />
                <button type={"submit"}>
                    <FiPlus size={25} color="#17181f"/>
                </button>
            </form>
            <h1>Você tem {taskList.length} tarefa(s)</h1>
            <section>
                {taskList.map((task, idx) => (
                    <article className={styles.taskList} key={idx}>
                        <Link href={`/board/${task.id}`}>
                            <p>{task.task}</p>
                        </Link>
                        <div className={styles.actions}>
                            <div>
                                <div>
                                    <FiCalendar size={20} color="#FFB800"/>
                                    <time>{task.createdFormated}</time>
                                </div>
                                <button>
                                    <FiEdit2 size={20} color="#FFF"/>
                                    <span>Editar</span>
                                </button>
                            </div>
                            <button onClick={()=>handleDelete(task.id)}>
                                <FiTrash size={20} color="#FF3636"/>
                                <span>Excluir</span>
                            </button>
                        </div>
                    </article>
                ))}
            </section>
        </main>

        <div className={styles.vipContainer}>
            <h3>Obrigado por apoiar esse projeto</h3>
            <div>
                <FiClock size={20} color="#FFF"/>
                <time>Ultima doação a 5 dias</time>
            </div>
        </div>

        <DonateButtton />
        </>
    )
} 

export const getServerSideProps: GetServerSideProps = async ({req}) => {
    const session = await getSession({req})

    const firebaseDB = getFirestore(firebaseApp)
    const tasks = query(collection(firebaseDB, 'tasks'), where('userEmail', '==', session?.user?.email))
    
    let data = await getDocs(tasks)
    let items = data.docs.map((doc) => {
        return {
            id: doc.id,
            createdFormated: format(doc.data().created.toDate(), 'dd MMMM yyyy'),
            ...doc.data()
        }
    })



    if(!session?.user) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return{props: {
        user: session?.user,
        data: JSON.stringify(items)
    }}
}

export default Board

// function getDocs(tasks: CollectionReference<DocumentData>) {
//     throw new Error("Function not implemented.")
// }
