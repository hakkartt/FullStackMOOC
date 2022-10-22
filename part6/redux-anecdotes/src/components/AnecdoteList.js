import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { notify } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state.anecdotes)
    const searchString = useSelector(state => state.filter).toLowerCase()
    const dispatch = useDispatch()

    const voteAndNotify = (anecdote) => {
        dispatch(voteAnecdote(anecdote.id))
        // const anecdote = anecdotes.find(i => i.id === id)
        dispatch(notify(`you voted '${anecdote.content}'`, 5))
      }

    return (
        <div>
            {
                anecdotes
                    .filter(
                        i => 
                        i.content.toLowerCase().includes(searchString)
                    )
                    .map(
                        i =>
                        <div key={i.id}>
                            <div>
                            {i.content}
                            </div>
                            <div>
                            has {i.votes}
                            <button onClick={() => voteAndNotify(i)}>vote</button>
                            </div>
                        </div>
                    )
            }
        </div>
    )
}

export default AnecdoteList