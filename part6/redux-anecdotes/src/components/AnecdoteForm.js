import { connect } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { notify } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {
  const createNew = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    props.createAnecdote(content)
    props.notify(`you created '${content}'`, 10)  
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

const mapDispathToProps = { createAnecdote, notify }

const ConnectedForm = connect(null, mapDispathToProps)(AnecdoteForm)
export default ConnectedForm