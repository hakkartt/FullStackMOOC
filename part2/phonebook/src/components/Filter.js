const Filter = ({ v, f }) =>
  <form>
  <div>
    filter shown with
    <input
      value={v}
      onChange={f}
    />
  </div>
  </form>

export default Filter