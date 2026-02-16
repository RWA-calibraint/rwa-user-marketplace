import { Descendant } from 'slate/dist/interfaces';

import { CustomText } from './interface';

export const extractText = (nodes: Descendant[]): string => {
  return nodes
    .map((node) => {
      if ('children' in node) {
        return extractText(node.children);
      } else {
        return (node as CustomText).text || '';
      }
    })
    .join(' ');
};

export const trimSlateContent = (content: Descendant[], limit: number): Descendant[] => {
  let charCount = 0;
  let shouldStop = false;

  const traverseAndTrim = (nodes: Descendant[]): Descendant[] => {
    return nodes
      .map((node): Descendant | null => {
        if (shouldStop) return null;

        if ('children' in node) {
          const newChildren: CustomText[] = [];

          for (const child of node.children) {
            if (shouldStop) break;

            if ('text' in child) {
              const remainingChars = limit - charCount;

              if (charCount + child.text?.length > limit) {
                newChildren.push({ ...child, text: child.text.slice(0, remainingChars) });
                shouldStop = true;
              } else {
                newChildren.push(child);
              }
              charCount += child.text?.length;
            } else {
              newChildren.push(child);
            }
          }

          return { ...node, children: newChildren };
        }

        return node;
      })
      .filter((node): node is Descendant => node !== null);
  };

  return traverseAndTrim(content);
};
