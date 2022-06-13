const PersonForm = ({ v1, v2, f1, f2, f3 }) =>
  <form onSubmit={f1}>
    <div>
      name: 
      <input 
        value={v1} 
        onChange={f2}
      />
    </div>
    <div>
      number: 
      <input 
        value={v2}
        onChange={f3}
      />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>

export default PersonForm