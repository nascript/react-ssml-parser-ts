import React, { useRef, useState } from "react"
import useSSMLParser from "./useSSMLParser"

const SSMLParserMarkText: React.FC = () => {
  const ssml = `
    <speak>
      <voice name="Joanna">Hello, how are you?</voice>
      <break time="1s"/>
      <prosody rate="slow">“As a non-native English speaker and someone who grew up in an Asian culture, English as a language appears very articulate and clear to me. And most well written English literature works, including poems, embody such almost straightforward characters, both in their wording and storytelling ... until I read Arundhati Roy’s The God of Small Things. I still remember how struck I was to see the English words be played in a way that’s mostly familiar to me in other Asian literature. The gentle singsong wording and wave-like storytelling combined with the vividness of English captured me like a dream. I’ve read many more English novels since, some as captivating and clever, but none carries the same magic.” Ling “The God of Small Things – though a fairly recent book – resonates very strongly with me. It explores caste, sexism, colonialism and the strange unspoken rules that tie Indian families together. Like in most great novels, the prose itself is stunning, with imagery fresh and original and at the same time, somehow familiar. I’m a girl from a South Indian village and I was raised by a single mother and my grandmother. Perhaps it is this coincidence that ties me so strongly to the book, to see in tangible words the burden that history passes along to Indian women.” Sita</prosody>
    </speak>
  `

  const parsedSSML = useSSMLParser(ssml)
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const speak = () => {
    if (isPlaying) return // Prevent multiple plays at the same time

    const utterance = new SpeechSynthesisUtterance()
    const texts = extractTexts(parsedSSML)
    const words = texts.join(" ").split(/\s+/)

    utterance.text = words.join(" ")

    utterance.onstart = () => {
      setIsPlaying(true)
    }

    utterance.onboundary = (event) => {
      if (event.name === "word") {
        const wordIndex = calculateWordIndex(event.charIndex, words)
        setHighlightedIndex(wordIndex)
      }
    }

    utterance.onend = () => {
      setIsPlaying(false)
      setHighlightedIndex(-1)
    }

    utteranceRef.current = utterance
    speechSynthesis.speak(utterance)
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

  return (
    <div className="App">
      <h1>SSML Parser</h1>
      <div
        style={{
          textAlign: "left",
          margin: "0 auto",
          width: "50%",
          backgroundColor: "lightgray",
          padding: 10,
          borderRadius: 5,
        }}
      >
        {renderTextWithHighlight(texts)}
      </div>
      <button
        style={{
          marginTop: '10, 0',
          width: "50%",
          backgroundColor: "salmon",
          padding: 10,
          borderRadius: 5,
          color: "white",
        }}
        onClick={speak}
        disabled={isPlaying}
      >
        Read Text
      </button>
    </div>
  )
}

export default SSMLParserMarkText
