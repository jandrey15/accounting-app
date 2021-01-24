import Head from 'next/head'
import Navbar from '../components/Navbar'

export default function Home() {
  return (
    <section>
      <Head>
        <title>Personal Accounting App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main>
        <h1>Accounting App</h1>
      </main>
    </section>
  )
}
