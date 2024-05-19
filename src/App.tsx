import "./App.css"
import SSMLParser from "./SSMLParser"
import SSMLParserMarkText from "./SSMLParserMarkText"
import SSMLParserMarkTextWithAudio from "./SSMLParserMarkTextWithAudio"

function App() {
  return (
    <div className="App">
      <h1>ASSESSMENT REACT SSML TEST</h1>

      {/* <SSMLParser /> */}
      <SSMLParserMarkText />
      {/* <SSMLParserMarkTextWithAudio /> */}
    </div>
  )
}

export default App
