const Notification = ({ msg, whatIsIt }) => {
  // whatIsIt = 1 if it is error message otherwise 0
  const style = whatIsIt
    ? { color: 'red', fontWeight: 'bold', border: '2px red solid', textAlign: 'center', padding: '5px' }
    : { color: 'green', fontWeight: 'bold', border: '2px green solid', textAlign: 'center', padding: '5px' }

  return (
    <p style={style}>{msg}</p>
  )
}

export default Notification
