const Filter = ({ str, f }) =>
  <form>
  <div>
    <b>find countries: </b>
    <input
      value={str}
      onChange={f}
    />
  </div>
  </form>

export default Filter