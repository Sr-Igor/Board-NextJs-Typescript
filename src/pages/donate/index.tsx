import styles from './style.module.scss'
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import {PayPalButtons} from '@paypal/react-paypal-js'
import { getFirestore, doc, getDoc, updateDoc, collection, query, addDoc} from 'firebase/firestore';
import { firebaseApp } from "../../services/firebase"
import { useState } from 'react';

type Props = {
    data: {
        id: string;
        name: string;
        email: string;
        image: string;
    }
}

const Donate = ({data}: Props) => {

    const [apoiador, setApoiador] = useState(false)

    const handleSaveDonate =  async () => {
        setApoiador(true)
        console.log("chamou")
        const firebaseDB = getFirestore(firebaseApp)
        const users = collection(firebaseDB, 'users')
        // const user = doc(firebaseDB, 'users', data.email)

        await addDoc(users, {
            id: data.email,
            name: data.name,
            email: data.email,
            image: data.image,
            donate: true,
            lastDoante: new Date().toString()
        })
    }

    return (
        <>
            <Head>
                <title>Donate</title>
            </Head>
            <main className={styles.container}>
                <img src="/images/rocket.svg" alt="Donate" />

                {apoiador &&
                    <div className={styles.vip}>
                        <img src={data.image}/>
                        <span>Parabéns você é um novo apoiador!</span>
                    </div>
                }
                

                <h1>Seja um apoiador do Projeto</h1>
                <h3>Contribua com apenas <span>R$1,00</span></h3>
                <strong>Apareca em nossa home e tenha acesso excluiso a plataforma</strong>

                <PayPalButtons
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: '1.00'
                                }
                            }]
                        })
                    }}
                    onApprove={(data: any, actions: any) => {
                        return actions.order.capture().then(function(details: any) {
                            handleSaveDonate()
                        })
                    }}
                />
            </main>
        </>
    )
}

export default Donate;

export const getServerSideProps: GetServerSideProps = async ({req}) => {
    const session = await getSession({req})

    if(!session){
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const data = {
        // id: session.user?.id as string,
        name: session.user?.name,
        email: session.user?.email,
        image: session.user?.image
    }

    return {
        props: {
            data: data
        }
    }
}
