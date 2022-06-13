const Persons = ({ arr, f }) => 
  <>
    {arr.map( x => 
      <p key={x.name}>
        {x.name} {x.number}
        <button onClick={() => f(x)}>delete</button>      
      </p> )}
  </>

export default Persons