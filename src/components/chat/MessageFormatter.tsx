/**
 * Message Formatter Component
 * Converts AI markdown responses to beautiful, user-friendly format
 */
import type { ReactElement } from 'react';

interface MessageFormatterProps {
  content: string;
}

export function MessageFormatter({ content }: MessageFormatterProps) {
  // Parse and format the message
  const formatMessage = (text: string): ReactElement[] => {
    const elements: ReactElement[] = [];
    
    // Split by newlines to handle paragraphs
    const lines = text.split('\n');
    let currentParagraph: string[] = [];
    let listItems: string[] = [];
    let inList = false;
    let key = 0;

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const paraText = currentParagraph.join(' ').trim();
        if (paraText) {
          elements.push(
            <p key={`para-${key++}`} className="mb-3 leading-relaxed">
              {formatInline(paraText)}
            </p>
          );
        }
        currentParagraph = [];
      }
    };

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${key++}`} className="mb-3 space-y-1.5 ml-4">
            {listItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-sky-400 mt-1">•</span>
                <span className="flex-1">{formatInline(item)}</span>
              </li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    lines.forEach((line) => {
      const trimmed = line.trim();

      // Empty line - flush current paragraph/list
      if (!trimmed) {
        if (inList) {
          flushList();
        } else {
          flushParagraph();
        }
        return;
      }

      // List item (starts with - or •)
      if (trimmed.match(/^[-•]\s+/)) {
        flushParagraph();
        inList = true;
        listItems.push(trimmed.replace(/^[-•]\s+/, ''));
        return;
      }

      // Numbered list item
      if (trimmed.match(/^\d+\.\s+/)) {
        flushParagraph();
        inList = true;
        listItems.push(trimmed.replace(/^\d+\.\s+/, ''));
        return;
      }

      // Header (starts with #)
      if (trimmed.match(/^#+\s+/)) {
        flushParagraph();
        flushList();
        const level = (trimmed.match(/^#+/) || [''])[0].length;
        const headerText = trimmed.replace(/^#+\s+/, '');
        const sizeClass = level === 1 ? 'text-lg' : level === 2 ? 'text-base' : 'text-sm';
        elements.push(
          <h3 key={`header-${key++}`} className={`font-semibold text-sky-300 mb-2 mt-4 ${sizeClass}`}>
            {formatInline(headerText)}
          </h3>
        );
        return;
      }

      // Code block (starts with ```)
      if (trimmed.startsWith('```')) {
        flushParagraph();
        flushList();
        return; // Skip code fence markers for now
      }

      // Regular text
      if (inList) {
        listItems.push(trimmed);
      } else {
        currentParagraph.push(trimmed);
      }
    });

    // Flush remaining content
    flushParagraph();
    flushList();

    return elements.length > 0 ? elements : [
      <p key="default" className="leading-relaxed">{formatInline(content)}</p>
    ];
  };

  // Format inline elements (bold, italic, code, links)
  const formatInline = (text: string): (string | ReactElement)[] => {
    const parts: (string | ReactElement)[] = [];
    let remaining = text;
    let partKey = 0;

    // Remove markdown bold (**text**)
    remaining = remaining.replace(/\*\*(.+?)\*\*/g, (match, p1) => {
      return p1; // Just return the text without asterisks
    });

    // Remove markdown italic (*text* or _text_)
    remaining = remaining.replace(/[*_](.+?)[*_]/g, (match, p1) => {
      return p1;
    });

    // Format inline code (`code`)
    const codeRegex = /`([^`]+)`/g;
    let lastIndex = 0;
    let match;

    while ((match = codeRegex.exec(remaining)) !== null) {
      // Add text before code
      if (match.index > lastIndex) {
        parts.push(remaining.slice(lastIndex, match.index));
      }
      // Add code
      parts.push(
        <code key={`code-${partKey++}`} className="rounded bg-sky-500/20 px-1.5 py-0.5 text-sky-300 font-mono text-xs">
          {match[1]}
        </code>
      );
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < remaining.length) {
      parts.push(remaining.slice(lastIndex));
    }

    return parts.length > 0 ? parts : [remaining];
  };

  return <div className="space-y-1">{formatMessage(content)}</div>;
}

