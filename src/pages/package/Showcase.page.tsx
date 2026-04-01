import MarkdownRenderer from "markdown"
import content from "../../../README.md?raw";

function ShowcasePage() {
  return (
    <div className="max-w-7xl">
        <MarkdownRenderer content={content}>
            
        </MarkdownRenderer>
    </div>
  )
}

export default ShowcasePage