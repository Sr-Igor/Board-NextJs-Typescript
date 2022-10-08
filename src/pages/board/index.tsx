import styles from "./styles.module.scss"
import Head from "next/head"
import { FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock, FiX } from "react-icons/fi"
import { DonateButtton } from "../../components/DonateButton"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import { useState, FormEvent } from "react"
import { firebaseApp } from "../../services/firebase"
import { getFirestore, getDocs, collection, addDoc, query, getDoc,where, deleteDoc, doc, updateDoc } from "firebase/firestore"
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
    donate: boolean
}

function Board({user, data, donate}: Props) {

    const [input, setInput] = useState('')
    const [taskList, setTaskList] = useState<Task[]>(JSON.parse(data))
    const [taskEdit, setTaskEdit] = useState<Task|null>(null)

    const handleAddTask = async (e: FormEvent) => {
        e.preventDefault()

        if(!input.trim()){
            return
        }

        const firebaseDB = getFirestore(firebaseApp)
        const tasks = collection(firebaseDB, 'tasks')

        if(taskEdit){
            const task = doc(firebaseDB, 'tasks', taskEdit.id)
            await updateDoc(task, {
                task: input
            }).then(() => {
                const newTaskList = taskList.map(task => {
                    if(task.id === taskEdit.id){
                        task.task = input
                    }
                    return task
                })
                setTaskList(newTaskList)
            })
            setTaskEdit(null)
            setInput('')
            return
        }

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

    const handleEdit = async(task: Task) => {
        setTaskEdit(task)
        setInput(task.task)
    }

    const handleCancelEdit = () => {
        setTaskEdit(null)
        setInput('')
    }

    return(
        <>
        <Head>
            <title>Minhas Tarefas - Board</title>
        </Head>
        <main className={styles.container}>
            {taskEdit && 
                <span className={styles.warnText}>
                    <button>
                        <FiX size={30} color="#FF3636" onClick={()=>handleCancelEdit()}/>
                    </button>
                    Você está editando uma tarefa!
                </span>
            }
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
                                <button onClick={()=>handleEdit(task)}>
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

        {donate &&
         <div className={styles.vipContainer}>
            <h3>Obrigado por ser um apoiador desse projeto!</h3>
            {/* <div>
                <FiClock size={20} color="#FFF"/>
                <time>Ultima doação a 5 dias</time>
            </div> */}
        </div>
        }

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

    const users = query(collection(firebaseDB, 'users'), where('email', '==', session?.user?.email))
    let data2 = await getDocs(users)
    let items2 = data2.docs.map((doc) => {
        return {
            ...doc.data()
        }
    })


    return{props: {
        user: session?.user,
        data: JSON.stringify(items),
        donate: items2[0]?.donate?true:false
    }}
}

export default Board