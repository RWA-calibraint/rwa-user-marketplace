'use client';
import { Select } from 'antd';
import { Bold, Heading1, Heading2, Italic, List, ListOrdered } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createEditor, Descendant, Editor, Range, Element as SlateElement, Text, Transforms } from 'slate';
import { Editable, ReactEditor, RenderElementProps, RenderLeafProps, Slate, withReact } from 'slate-react';

import { ERROR_MESSAGE } from '@/helpers/constants/error-message';
import { showErrorToast } from '@/helpers/constants/toast.notification';
import textcss from '@components/TextEditor/editor.module.scss';
import { extractText } from '@helpers/slate/function';
import { CustomText } from '@helpers/slate/interface';

type CustomElement = {
  type: 'paragraph' | 'bulleted-list' | 'numbered-list' | 'heading-two' | 'heading-one' | 'list-item';
  children: CustomText[];
};
declare module 'slate' {
  interface CustomTypes {
    Editor: ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const Toolbar = ({ editor }: { editor: Editor }) => {
  const { Option } = Select;

  const isFormatActive = (format: keyof CustomText) => {
    const [match] = Editor.nodes(editor, {
      match: (n) => Text.isText(n) && n[format] === true,
      mode: 'all',
    });

    return !!match;
  };

  const toggleFormat = (format: keyof CustomText) => {
    const isActive = isFormatActive(format);

    Transforms.setNodes(editor, { [format]: isActive ? null : true }, { match: (n) => Text.isText(n), split: true });

    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  const toggleBlock = (format: CustomElement['type']) => {
    const { selection } = editor;

    if (selection && !Range.isCollapsed(selection)) {
      // eslint-disable-next-line unused-imports/no-unused-vars
      const [blockEntry] = Editor.nodes(editor, {
        match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
      });

      const start = Range.start(selection);
      const end = Range.end(selection);

      Transforms.splitNodes(editor, { at: end });
      Transforms.splitNodes(editor, { at: start });
      const midBlock = Editor.after(editor, start);

      if (midBlock) {
        const midRange = { anchor: start, focus: midBlock };

        Transforms.select(editor, midRange);
        if (format === 'bulleted-list' || format === 'numbered-list') {
          Transforms.setNodes(editor, { type: 'list-item' });
          const block = { type: format, children: [] };

          Transforms.wrapNodes(editor, block);
        } else {
          Transforms.setNodes(editor, { type: format });
        }
      }
    } else {
      const isActive = isBlockActive(format);
      const isList = format === 'bulleted-list' || format === 'numbered-list';

      if (isList && isActive) {
        Transforms.unwrapNodes(editor, {
          match: (n) => SlateElement.isElement(n) && (n.type === 'bulleted-list' || n.type === 'numbered-list'),
          split: true,
        });

        Transforms.setNodes(editor, { type: 'paragraph' });
      } else {
        if (isList) {
          Transforms.setNodes(editor, { type: 'list-item' });
          const block = { type: format, children: [] };

          Transforms.wrapNodes(editor, block, {
            match: (n) => SlateElement.isElement(n) && n.type === 'list-item',
          });
        } else {
          Transforms.setNodes(editor, { type: format });
        }
      }
    }
  };

  const isBlockActive = (format: CustomElement['type']) => {
    const [match] = Editor.nodes(editor, {
      match: (n) =>
        SlateElement.isElement(n) &&
        (n.type === format || (format === 'list-item' && (n.type === 'bulleted-list' || n.type === 'numbered-list'))),
    });

    return !!match;
  };

  // const removeFormatting = () => {
  //   Transforms.unsetNodes(editor, ['bold', 'italic', 'underline'], {
  //     match: (n) => Text.isText(n),
  //     split: true,
  //   });
  //   Transforms.setNodes(editor, { type: 'paragraph' });
  // };

  return (
    <div
      className="d-flex gap-2 border-primary-1 editor radius-2-2-0-0"
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Select
        defaultValue="paragraph"
        className={textcss['borderless-select']}
        onChange={(value) => toggleBlock(value as CustomElement['type'])}
      >
        <Option value="paragraph">Normal</Option>
        <Option value="heading-one">
          <span>
            <Heading1 size={16} /> Heading 1
          </span>
        </Option>
        <Option value="heading-two">
          <span>
            <Heading2 size={16} /> Heading 2
          </span>
        </Option>
      </Select>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFormat('bold');
        }}
        style={{
          backgroundColor: isFormatActive('bold') ? '#ddd' : 'transparent',
          border: '1px solid #ffffff',
          borderRadius: '4px',
          padding: '4px 8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Bold size={16} />
      </button>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFormat('italic');
        }}
        style={{
          backgroundColor: isFormatActive('italic') ? '#ddd' : 'transparent',
          border: '1px solid #ffffff',
          borderRadius: '4px',
          padding: '4px 8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Italic size={16} />
      </button>
      {/* <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFormat('underline');
        }}
        style={{
          backgroundColor: isFormatActive('underline') ? '#ddd' : 'transparent',
          border: '1px solid #ffffff',
          borderRadius: '4px',
          padding: '4px 8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Underline size={16} />
      </button> */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleBlock('bulleted-list');
        }}
        style={{
          backgroundColor: isBlockActive('bulleted-list') ? '#ddd' : 'transparent',
          border: '1px solid #ffffff',
          borderRadius: '4px',
          padding: '4px 8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <List size={16} />
      </button>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleBlock('numbered-list');
        }}
        style={{
          backgroundColor: isBlockActive('numbered-list') ? '#ddd' : 'transparent',
          border: '1px solid #ffffff',
          borderRadius: '4px',
          padding: '4px 8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <ListOrdered size={16} />
      </button>
      {/* <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          removeFormatting();
        }}
        style={{
          backgroundColor: 'transparent',
          border: '1px solid #ffffff',
          borderRadius: '4px',
          padding: '4px 8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <RemoveFormatting size={16} />
      </button> */}
    </div>
  );
};

const SlateEditor = ({ value, onChange }: { value: Descendant[]; onChange: (value: Descendant[]) => void }) => {
  const [charCount, setCharCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const editor = useMemo(() => withReact(createEditor()), []);
  const [slateValue, setSlateValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);

  useEffect(() => {
    if (value && JSON.stringify(value) !== JSON.stringify(editor.children)) {
      try {
        if (Array.isArray(value)) {
          const text = extractText(value);

          setCharCount((prev) => (prev !== text.length ? text.length : prev));
          setError(null);

          setSlateValue(value as Descendant[]);

          Transforms.deselect(editor);
          Transforms.removeNodes(editor, { at: [0] });
          Transforms.insertNodes(editor, value, { at: [0] });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.EDITOR_ERROR;

        showErrorToast(errorMessage);
      }
    }
  }, [value, editor]);

  const handleChange = (newValue: Descendant[]) => {
    onChange(newValue);

    const text = extractText(newValue);

    if (text.length > 4096) {
      setError('Character limit exceeded! Max 4096 characters allowed.');
      setCharCount(text.length);

      return;
    }

    setError(null);
    setCharCount(text.length);
  };

  const renderElement = ({ attributes, children, element }: RenderElementProps) => {
    switch (element.type) {
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>;
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>;
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>;
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>;
      case 'list-item':
        return <li {...attributes}>{children}</li>;
      default:
        return <span {...attributes}>{children}</span>;
    }
  };

  const renderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
    if (leaf.bold) {
      children = <strong>{children}</strong>;
    }
    if (leaf.italic) {
      children = <em>{children}</em>;
    }
    // if (leaf.underline) {
    //   children = <u>{children}</u>;
    // }

    return <span {...attributes}>{children}</span>;
  };

  return (
    <Slate editor={editor} initialValue={slateValue} onChange={handleChange}>
      <Toolbar editor={editor} />
      <div className="p-8 border-primary-1 radius-0-0-2-2 border-top-none">
        <Editable
          key="editable"
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Asset description"
          spellCheck
          maxLength={4096}
          className="editable"
          style={{ minHeight: '100px', outline: 'none' }}
          onPaste={(event) => {
            event.preventDefault();
            const paste = event.clipboardData.getData('text');
            const currentText = extractText(editor.children);
            const newText = currentText + paste;

            if (newText.length > 4096) {
              setError('Character limit exceeded! Max 4096 characters allowed.');
            } else {
              Transforms.insertText(editor, paste);
              setCharCount(newText.length);
              setError(null);
            }
          }}
        />
      </div>
      <div className="d-flex justify-flex-end m-t-8">
        {<p className="f-14-20-400-status-red">{error}</p>}
        <div className="d-flex justify-flex-end f-14-20-400-tertiary">{charCount}/4096</div>
      </div>
    </Slate>
  );
};

export default SlateEditor;
