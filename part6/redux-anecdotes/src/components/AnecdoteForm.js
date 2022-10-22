import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { notify } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  const createNew = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecdote(content))
    dispatch(notify(`you voted \'${content}\'`, 10))
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