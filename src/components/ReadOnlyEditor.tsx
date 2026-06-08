'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export const ReadOnlyEditor = ({ content }: { content: any }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: false,
  });

  if (!editor) {
    return null;
  }

  return (
    <div style={{ pointerEvents: 'none' }}>
      <EditorContent editor={editor} />
    </div>
  );
};
