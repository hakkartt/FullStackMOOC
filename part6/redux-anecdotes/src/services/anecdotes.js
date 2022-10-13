import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAllAnecdotes = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createAnecdote = async (content) => {
  const object = { content, votes: 0 }
  const response = await axios.post(baseUrl, object)
  return response.data
}

const incrementVotes = async (id) => {
  const anecdote = await axios.get(`${baseUrl}/${id}`)
  const tbc = anecdote.data
  const updated = {
    ...tbc,
    votes: tbc.votes + 1
  }
  const response = await axios.put(`${baseUrl}/${id}`, updated)
  return response.data
}

const TBE = { getAllAnecdotes, createAnecdote, incrementVotes }

export default TBE