import { useDispatch } from 'react-redux'
import { create } from '../reducers/anecdoteReducer'
import { pop, vanish } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  const createNew = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(create(await anecdoteService.createAnecdote(content)))
    dispatch(pop(`you created '${content}'`))
    setTimeout(() => {
      dispatch(vanish())
    }, 5000)
  }

  return (
  <div>
    <h2>create new</h2>
      <form onSubmit={createNew}>
        <div><input name="anecdote" /></div>
        <button type="submit">create</button>
      </form>
  </div>
  )
}

export default AnecdoteForm