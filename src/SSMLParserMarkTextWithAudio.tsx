import React, { useRef, useState } from "react"
import useSSMLParser from "./useSSMLParser"

const SSMLParserMarkTextWithAudio: React.FC = () => {
  const ssml = `
    <speak>
      <voice name="Joanna">Hello, how are you?</voice>
      <break time="1s"/>
      <prosody rate="slow">This is a test of SSML parsing. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quaerat dolores dolor dolore dicta quos illum enim earum molestias eligendi quasi magni, corrupti praesentium voluptatibus molestiae ipsum recusandae! Animi, molestias iste hic impedit tempora expedita adipisci exercitationem repellendus culpa corporis, voluptas sit est ipsam dolorum magnam facilis optio itaque porro. Necessitatibus cupiditate obcaecati quaerat aliquid quasi ratione fugit ipsa omnis deleniti nihil aliquam, labore nesciunt repudiandae, illo dignissimos doloremque fuga ut? Minima modi doloribus eum et molestias nobis, facere blanditiis. Quibusdam dolore veniam obcaecati odit, asperiores inventore consequuntur. Magnam asperiores, culpa, ut fuga illum, in quidem numquam alias mollitia earum tempora!</prosody>
    </speak>
  `

  const parsedSSML = useSSMLParser(ssml)
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const [audioUrl, setAudioUrl] = useState<string>("")
  const audioRef = useRef<HTMLAudioElement>(null)

  const speak = () => {
    if (!window.speechSynthesis) return

    const utterance = new SpeechSynthesisUtterance()
    const texts = extractTexts(parsedSSML)
    const words = texts.join(" ").split(/\s+/)

    utterance.text = words.join(" ")
    utterance.onboundary = (event) => {
      if (event.name === "word") {
        const wordIndex = calculateWordIndex(event.charIndex, words)
        setHighlightedIndex(wordIndex)
      }
    }
    utterance.onend = () => {
      setHighlightedIndex(-1)
    }

    window.speechSynthesis.speak(utterance)

    // Generate audio URL
    const audioContext = new AudioContext()
    const mediaStreamDestination = audioContext.createMediaStreamDestination()
    const mediaStream = mediaStreamDestination.stream
    const mediaRecorder = new MediaRecorder(mediaStream)

    const chunks: Blob[] = []
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" })
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
    }

    mediaRecorder.start()
    utterance.onend = () => {
      mediaRecorder.stop()
    }

    const source = audioContext.createMediaStreamSource(mediaStream)
    source.connect(mediaStreamDestination)
    source.connect(audioContext.destination)
  }

  const calculateWordIndex = (charIndex: number, words: string[]): number => {
    let cumulativeLength = 0
    for (let i = 0; i < words.length; i++) {
      cumulativeLength += words[i].length + 1 // +1 for the space
      if (charIndex < cumulativeLength) {
        return i
      }
    }
    return words.length - 1
  }

  const extractTexts = (node: any): string[] => {
    if (!node) return []
    if (node.text) return [node.text]
    return node.children.flatMap(extractTexts)
  }

  const renderTextWithHighlight = (texts: string[]) => {
    const words = texts.join(" ").split(/\s+/)
    return words.map((word, index) => (
      <span
        key={index}
        style={{
          backgroundColor:
            index === highlightedIndex ? "yellow" : "transparent",
        }}
      >
        {word + " "}
      </span>
    ))
  }

  const texts = extractTexts(parsedSSML)

  console.log('audioUrl', audioUrl)
  return (
    <div>
      <h1>SSML Parser</h1>
      
      <div>{renderTextWithHighlight(texts)}</div>
      <button onClick={speak}>Play Audio</button>
      {audioUrl && <audio controls src={audioUrl} ref={audioRef} />}
    </div>
  )
}

export default SSMLParserMarkTextWithAudio
