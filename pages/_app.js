import '../styles/index.css'
import { TodosProvider } from '../contexts/TodosContext'
import { IncExpensProvider } from '../contexts/IncomesExpensesContext'

function MyApp({ Component, pageProps }) {
  return (
    <TodosProvider>
      <IncExpensProvider>
        <div className='container mx-auto my-10 max-w-xl'>
          <Component {...pageProps} />
        </div>
      </IncExpensProvider>
    </TodosProvider>
  )
}

export default MyApp
