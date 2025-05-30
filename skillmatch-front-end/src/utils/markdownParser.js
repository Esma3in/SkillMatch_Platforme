/**
 * Simple Markdown Parser
 * 
 * This utility helps parse and render markdown-like formatting in AI responses
 */

/**
 * Parses and renders markdown content into React components
 * @param {string} text The markdown text to parse
 * @returns {Array} Array of React elements
 */
export const parseMarkdown = (text) => {
  if (!text || typeof text !== 'string') {
    return [<p key="error">Error displaying content</p>];
  }

  // Split the text by code blocks first
  const parts = [];
  let lastIndex = 0;
  let key = 0;

  // Process code blocks
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  let match;

  try {
    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block (processed for other markdown)
      if (match.index > lastIndex) {
        const beforeText = text.substring(lastIndex, match.index);
        parts.push(
          <div key={`text-${key++}`} className="markdown-text">
            {parseInlineMarkdown(beforeText)}
          </div>
        );
      }

      // Add code block
      const language = match[1] || 'javascript';
      parts.push(
        <pre key={`code-${key++}`} className={`language-${language}`}>
          <div className="code-header">
            <span className="code-language">{language || 'code'}</span>
            <button 
              className="copy-button"
              onClick={() => copyToClipboard(match[2])}
              title="Copy code"
            >
              Copy
            </button>
          </div>
          <code>{match[2]}</code>
        </pre>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      parts.push(
        <div key={`text-${key++}`} className="markdown-text">
          {parseInlineMarkdown(remainingText)}
        </div>
      );
    }

    return parts.length ? parts : [<p key="original">{text}</p>];
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return [<p key="error-fallback">{text}</p>];
  }
};

/**
 * Parse inline markdown elements like bold, italic, links, etc.
 * @param {string} text Text to parse for inline markdown
 * @returns {Array} Array of React elements
 */
const parseInlineMarkdown = (text) => {
  if (!text) return null;
  
  // Split text by newlines and create paragraphs
  const paragraphs = text.split('\n\n').filter(Boolean);
  
  return paragraphs.map((paragraph, pIndex) => {
    // Process lists
    if (paragraph.trim().startsWith('- ') || paragraph.trim().match(/^\d+\.\s/)) {
      const items = paragraph.split('\n').filter(Boolean);
      const isOrdered = items[0].trim().match(/^\d+\.\s/);
      
      const ListTag = isOrdered ? 'ol' : 'ul';
      
      return (
        <ListTag key={`list-${pIndex}`} className={isOrdered ? 'ordered-list' : 'unordered-list'}>
          {items.map((item, iIndex) => {
            const content = item.replace(/^-\s|^\d+\.\s/, '');
            return <li key={`item-${iIndex}`}>{processInlineElements(content)}</li>;
          })}
        </ListTag>
      );
    }
    
    // Check if this is a heading
    const headingMatch = paragraph.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = headingMatch[2];
      
      const HeadingTag = `h${level}`;
      return <HeadingTag key={`heading-${pIndex}`}>{processInlineElements(content)}</HeadingTag>;
    }
    
    // Regular paragraph
    return <p key={`p-${pIndex}`}>{processInlineElements(paragraph)}</p>;
  });
};

/**
 * Process inline markdown elements (bold, italic, links)
 * @param {string} text Text to process
 * @returns {Array} Array of React elements and strings
 */
const processInlineElements = (text) => {
  if (!text) return null;
  
  // Process inline code first
  const parts = [];
  let lastIndex = 0;
  let inlineCodeRegex = /`([^`]+)`/g;
  let match;
  let key = 0;
  
  while ((match = inlineCodeRegex.exec(text)) !== null) {
    // Add text before inline code
    if (match.index > lastIndex) {
      parts.push(processBoldItalic(text.substring(lastIndex, match.index), key++));
    }
    
    // Add inline code
    parts.push(<code key={`code-${key++}`} className="inline-code">{match[1]}</code>);
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(processBoldItalic(text.substring(lastIndex), key++));
  }
  
  return parts.length ? parts : text;
};

/**
 * Process bold and italic text
 * @param {string} text Text to process
 * @param {number} keyPrefix Prefix for React keys
 * @returns {Array|string} Processed text
 */
const processBoldItalic = (text, keyPrefix) => {
  // For simplicity, we'll just handle basic bold and italic
  // In a real app, you'd want a more robust solution
  
  // Bold
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // If no formatting was applied, return the text as is
  if (!text.includes('<')) return text;
  
  // Otherwise parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = text;
  
  // Convert the HTML nodes to React elements
  const result = [];
  let i = 0;
  
  Array.from(tempDiv.childNodes).forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      result.push(node.textContent);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'STRONG') {
        result.push(<strong key={`${keyPrefix}-strong-${i++}`}>{node.textContent}</strong>);
      } else if (node.tagName === 'EM') {
        result.push(<em key={`${keyPrefix}-em-${i++}`}>{node.textContent}</em>);
      }
    }
  });
  
  return result.length ? result : text;
};

/**
 * Copy text to clipboard
 * @param {string} text Text to copy
 */
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(
    () => {
      // Show a temporary "Copied!" tooltip
      const tooltip = document.createElement('div');
      tooltip.textContent = 'Copied!';
      tooltip.className = 'copy-tooltip';
      document.body.appendChild(tooltip);
      
      // Position near mouse
      const updatePosition = (e) => {
        tooltip.style.left = `${e.clientX + 10}px`;
        tooltip.style.top = `${e.clientY + 10}px`;
      };
      
      document.addEventListener('mousemove', updatePosition);
      
      // Remove after a short delay
      setTimeout(() => {
        document.removeEventListener('mousemove', updatePosition);
        document.body.removeChild(tooltip);
      }, 1000);
    },
    (err) => {
      console.error('Could not copy text: ', err);
    }
  );
}; 