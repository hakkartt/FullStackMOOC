import { connect } from 'react-redux'

const Notification = (props) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  if (props.notification[0]) {
    return (
      <div style={style}>
        {props.notification[0]}
      </div>
    )
  } else return ( <div /> )
}

const mapStateToProps = (state) => {
  return { notification: state.notification }
}

const ConnectedNotifications = connect(mapStateToProps)(Notification)

export default ConnectedNotifications

