export const formatTime = (ms: number) => {
  let hundredths = Math.round(ms / 10)
  let seconds = hundredths / 100
  hundredths = (seconds - Math.floor(seconds)) * 100
  seconds = Math.floor(seconds)
  let minutes = seconds / 60
  seconds = (minutes - Math.floor(minutes)) * 60
  minutes = Math.floor(minutes)
  let hours = minutes / 60
  minutes = (hours - Math.floor(hours)) * 60
  hours = Math.floor(hours)
  const strs = [
    hours ? hours.toFixed(0) : null,
    minutes ? minutes.toFixed(0).padStart(2, '0') : null,
    seconds ? seconds.toFixed(0).padStart(2, '0') : '00'
  ]
  let nonEmpty = []
  for (let i of strs) {
    if (i || nonEmpty.length) {
      nonEmpty.push(i)
    }
  }
  return nonEmpty.join(':') + '.' + hundredths.toFixed(0).padStart(2, '0')
}
