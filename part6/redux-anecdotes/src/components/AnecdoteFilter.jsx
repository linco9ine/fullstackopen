import { useDispatch } from 'react-redux'
import { filter } from '../reducers/filterReducer'

const AnecdoteFilter = () => {
  const dispatch = useDispatch()
  
  const handleFilter = (event) => {
    event.preventDefault()

    const filterValue = event.target.value
    dispatch(filter(filterValue))
  }

  return (
    <div>
      filter <input onChange={handleFilter} />
    </div>
  )
}

export default AnecdoteFilter
