import { SessionProvider } from "next-auth/react"
import { AppProps } from "next/app"
import Header from "../components/Header"
import "../styles/global.scss"
import {PayPalScriptProvider} from '@paypal/react-paypal-js'

const payPalOptions = {
    "client-id": "Acg38fzq7yLCCamv9ShUkGzDgp_r_wgmv5DeEE--Khj0jJt5i4hS9Le7hfC39ygyhO6gnNY3V7Xm15Do",
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
