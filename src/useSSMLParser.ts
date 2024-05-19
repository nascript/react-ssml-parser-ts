import { useState, useEffect } from "react"

const useSSMLParser = (ssml: string) => {
  const [parsedSSML, setParsedSSML] = useState<any>(null)

  useEffect(() => {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(ssml, "application/xml")

    const traverseNode = (node: Node): any => {
      if (node.nodeType === 1) {
        const element = node as Element
        const children = Array.from(element.childNodes).map(traverseNode)
        return {
          tag: element.tagName,
          attributes: Array.from(element.attributes).reduce((acc, attr) => {
            acc[attr.name] = attr.value
            return acc
          }, {} as any),
          children,
        }
      }
      if (node.nodeType === 3) {
        return { text: node.nodeValue }
      }
      return null
    }

    setParsedSSML(traverseNode(xmlDoc.documentElement))
  }, [ssml])

  return parsedSSML
}

export default useSSMLParser
