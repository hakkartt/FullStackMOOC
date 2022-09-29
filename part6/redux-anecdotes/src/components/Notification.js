import { useSelector } from 'react-redux'

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  
  const notificationMsg = useSelector(state => state.notification)
  if (notificationMsg) {
    return (
      <div style={style}>
        {notificationMsg}
      </div>
    )
  } else {
    return <></>
  }
}

export default Notification