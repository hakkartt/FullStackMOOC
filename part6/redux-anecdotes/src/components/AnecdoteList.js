import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { pop, vanish } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state.anecdotes)
    const searchString = useSelector(state => state.filter).toLowerCase()
    const dispatch = useDispatch()

    const voteAndNotify = (id) => {
        dispatch(voteAnecdote(id))
        const anecdote = anecdotes.find(i => i.id === id)
        dispatch(vanish())
        dispatch(pop(`you voted '${anecdote.content}'`))
        setTimeout(() => {
          dispatch(vanish())
        }, 5000)
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
                            <button onClick={() => voteAndNotify(i.id)}>vote</button>
                            </div>
                        </div>
                    )
            }
        </div>
    )
}

export default AnecdoteList