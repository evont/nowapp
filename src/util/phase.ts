export default function getPhaseStyle(phase, allWidth) {
  let phaseStyle = ''
  const shadowColor = 'rgba(0, 0, 0, .7)'
  const lightColor = 'rgba(255, 255, 255, .5)'
  if (phase <= 0.25) {
    phaseStyle = `border-right: ${phase / 0.25 * allWidth}px solid ${lightColor};background-color: ${shadowColor}`
  } else if (phase <= 0.5) {
    phaseStyle = `border-left: ${(0.5 - phase) / 0.25 * allWidth}px solid ${shadowColor}; background-color: ${lightColor}`
  } else if (phase <= 0.75)  {
    phaseStyle = `border-right: ${(phase - 0.5) / 0.25 * allWidth}px solid ${shadowColor};  background-color: ${lightColor}`
  } else if (phase <= 1) {
    phaseStyle = `border-left: ${(1 - phase) / 0.25 * allWidth}px solid ${lightColor};background-color: ${shadowColor}`
  }
  return phaseStyle;
}