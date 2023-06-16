import '../styles/globals.css'
import { TodosProvider } from '../contexts/TodosContext'
import { IncExpensProvider } from '../contexts/IncomesExpensesContext'

function MyApp({ Component, pageProps }) {
  return (
    <TodosProvider>
      <IncExpensProvider>
        <div className='container mx-auto max-w-4xl'>
          <Component {...pageProps} />
        </div>
      </IncExpensProvider>
    </TodosProvider>
  )
}

export default MyApp
