


const RoundProgress = ({
  lockTimestamp,
  closeTimestamp,
  ...props
}) => {
  const startMs = lockTimestamp * 1000
  const endMs = closeTimestamp * 1000
  const now = Date.now()
  const rawProgress = ((now - startMs) / (endMs - startMs)) * 100
  const progress = rawProgress <= 100 ? rawProgress : 100

  return    <div style={{ width: '100%', padding: '0px' }}>
  <div
    style={{
      height: '10px',
      width: '100%',
      backgroundColor: 'rgb(53 53 71 / var(--tw-bg-opacity))',
      borderRadius: '0px',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        width: `${progress}%`,
        height: '100%',
        backgroundColor: '#007bff',
        borderRadius: '00px',
        transition: 'width 0.3s ease',
      }}
    ></div>
  </div>
  {/* <div style={{ textAlign: 'center', marginTop: '5px' }}>{Math.round(progress)}%</div> */}
</div>
}

export default RoundProgress
