'use client';
import { FC, JSX, useState } from 'react';
import { Descendant, Text } from 'slate';

interface RenderSlateContentProps {
  content: Descendant[];
  charLimit?: number;
  showMore?: boolean;
}

const RenderSlateContent: FC<RenderSlateContentProps> = ({ content, charLimit = 350, showMore = true }) => {
  const [showFullText, setShowFullText] = useState(false);

  const countTotalCharacters = (nodes: Descendant[]): number => {
    let totalCharCount = 0;

    const traverseNodes = (nodes: Descendant[]) => {
      nodes.forEach((node) => {
        if (Text.isText(node)) {
          totalCharCount += node.text.length;
        } else if (node.children) {
          traverseNodes(node.children);
        }
      });
    };

    traverseNodes(nodes);

    return totalCharCount;
  };

  const trimContent = (nodes: Descendant[], limit: number): Descendant[] => {
    let charCount = 0;
    let shouldStop = false;

    const traverseAndTrim = (nodes: Descendant[]): Descendant[] => {
      return nodes
        .map((node) => {
          if (shouldStop) return null;

          if (Text.isText(node)) {
            const remainingChars = limit - charCount;

            if (charCount + node.text.length > limit) {
              const trimmedText = node.text.slice(0, remainingChars) + '...';

              charCount += remainingChars;
              shouldStop = true;

              return { ...node, text: trimmedText };
            } else {
              charCount += node.text.length;

              return node;
            }
          } else if (node.children) {
            const newChildren = traverseAndTrim(node.children);

            return { ...node, children: newChildren };
          }

          return node;
        })
        .filter(Boolean) as Descendant[];
    };

    return traverseAndTrim(nodes);
  };

  // Function to render nodes
  const renderNode = (node: Descendant, key: number): JSX.Element | null => {
    if (Text.isText(node)) {
      let textElement: JSX.Element = <span>{node.text}</span>;

      // Apply formatting if any
      if (node.bold) textElement = <strong>{textElement}</strong>;
      if (node.italic) textElement = <em>{textElement}</em>;
      if (node.underline) textElement = <u>{textElement}</u>;

      return <span key={key}>{textElement}</span>;
    }

    if (node.children) {
      let Tag: keyof JSX.IntrinsicElements = 'div';
      let className = '';

      switch (node.type) {
        case 'bulleted-list':
          Tag = 'ul';
          break;
        case 'numbered-list':
          Tag = 'ol';
          break;
        case 'paragraph':
          Tag = 'p';
          break;
        case 'heading-one':
          Tag = 'h1';
          className = 'slate-heading';
          break;
        case 'heading-two':
          Tag = 'h2';
          className = 'slate-heading';
          break;
        case 'list-item':
          Tag = 'li';
          break;
        default:
          Tag = 'div';
      }

      return (
        <Tag key={key} className={className}>
          {node.children.map((child, index) => renderNode(child, index))}
        </Tag>
      );
    }

    return null;
  };

  const totalCharCount = countTotalCharacters(content);
  const trimmedContent = trimContent(content, charLimit);

  return (
    <div>
      <div>
        {showFullText
          ? content.map((node, index) => renderNode(node, index))
          : trimmedContent.map((node, index) => renderNode(node, index))}
      </div>
      {showMore && totalCharCount > charLimit && (
        <button className="read-more" onClick={() => setShowFullText(!showFullText)}>
          {showFullText ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};

export default RenderSlateContent;
