import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { pop, vanish } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state.anecdotes)
    const dispatch = useDispatch()

    const voteAndNotify = (id) => {
        dispatch(vote(id))
        const anecdote = anecdotes.find(n => n.id === id)
        dispatch(pop(`you voted '${anecdote.content}'`))
        setTimeout(() => {
          dispatch(vanish())
        }, 5000)
      }

    return (
        <div>
            {
            anecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                    {anecdote.content}
                    </div>
                    <div>
                    has {anecdote.votes}
                    <button onClick={() => dispatch(voteAndNotify(anecdote.id))}>vote</button>
                    </div>
                </div>
                )
            }
        </div>
    )
}

export default AnecdoteList