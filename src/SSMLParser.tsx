import React from "react"
import useSSMLParser from "./useSSMLParser"

const SSMLParser: React.FC = () => {
  const ssml = `
    <speak>
      <voice name="Joanna">Hello, how are you?</voice>
      <break time="1s"/>
      <prosody rate="slow">This is a test of SSML parsing.</prosody>
    </speak>
  `

  const parsedSSML = useSSMLParser(ssml)

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance()
    utterance.text = parsedSSMLToText(parsedSSML)
    speechSynthesis.speak(utterance)
  }

  const parsedSSMLToText = (node: any): string => {
    if (!node) return ""
    if (node.text) return node.text
    return node.children.map(parsedSSMLToText).join(" ")
  }

  return (
    <div>
      <h1>SSML Parser</h1>
      {/* <pre>{JSON.stringify(parsedSSML, null, 2)}</pre> */}
      <button onClick={speak}>Play Audio</button>
    </div>
  )
}

export default SSMLParser
