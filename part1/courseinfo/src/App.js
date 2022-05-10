const Header = (props) => {
  return (
    <h1>
      {props.course}
    </h1>
  )
}


const Part = (props) => {
  return (
    <p>
      {props.part} {props.exercises}
    </p>
  )
}


const Total = (props) => {
  return (
    <p>
      Number of exercises {props.total}
    </p>
  )
}


const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  let total = 0

  return (
    <div>
      <Header course={course.name} />
      {
        course.parts.map((i) => {
          total += i.exercises
          return (<Part part={i.name} exercises={i.exercises} />)
        })
      }      
      <Total total={total} />
    </div>
  )
}

export default App