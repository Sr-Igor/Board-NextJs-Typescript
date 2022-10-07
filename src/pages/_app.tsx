import { SessionProvider } from "next-auth/react"
import { AppProps } from "next/app"
import Header from "../components/Header"
import "../styles/global.scss"
import {PayPalScriptProvider} from '@paypal/react-paypal-js'

const payPalOptions = {
    "client-id": "AdEHDr3l195opZnu-I4heIz1kICJ2zI0LI0eGinMB3xR8Q7ZbstmZGjWZ5uVQK86rGhg4ddRgIxkh5n8",
    currency: "BRL",
    intent: "capture"
}

function MyApp({ Component, pageProps }: any) {
  return (
    <SessionProvider session={pageProps.session}>
      <PayPalScriptProvider options={payPalOptions}>
        <Header />
        <Component {...pageProps} />
      </PayPalScriptProvider>
    </SessionProvider>
  )
}

export default MyApp
