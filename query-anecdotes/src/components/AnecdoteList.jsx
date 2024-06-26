import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from '../requests'
import { useNotificationDispatch } from "../NotificationContext"

const Anecdote = ({ anecdote, handleClick }) => {
  return(
    <li>
      {anecdote.content}<br />
      has {anecdote.votes} votes
      <button onClick={handleClick}> vote </button>
    </li>
  )
}

const AnecdoteList = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const updateAnecdoteMutation = useMutation(updateAnecdote, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      },
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1 })
    dispatch({
      type:'SET',
      payload:`anecdote '${anecdote.content}' voted`})
    setTimeout(() => {
      dispatch({
        type:'CLEAR'})
    }, 5000)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 5,
    refetchOnWindowFocus: false
  })

  if ( result.isLoading ) {
    return <div>loading data...</div>
  } else if ( result.isError) {
    return <div> anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return(
    <ul>
      {anecdotes.filter(anecdote => anecdote.content.toLowerCase()).sort((a, b) => b.votes - a.votes).map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => 
            handleVote(anecdote)
          }
        />
      )}
    </ul>
  )
}

export default AnecdoteList
