import { useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { yCollab } from 'y-codemirror.next';
import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';

const getLanguageExtension = (lang) => {
  switch (lang) {
    case 'python': return python();
    case 'java': return java();
    case 'cpp':
    case 'c': return cpp();
    default: return javascript();
  }
};

export default function CollaborativeEditor({ roomId, username, language = 'javascript', onCodeChange }) {
  const editorRef = useRef(null);
  const viewRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const ydoc = new Y.Doc();

    const provider = new WebsocketProvider(
      'ws://localhost:5000/yjs',
      roomId,
      ydoc
    );

    provider.awareness.setLocalStateField('user', {
      name: username || 'Anonymous',
      color: '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0'),
    });

    const ytext = ydoc.getText('codemirror');

    // Send code to parent whenever it changes
    ytext.observe(() => {
      if (onCodeChange) onCodeChange(ytext.toString());
    });

    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        basicSetup,
        getLanguageExtension(language), // ← dynamic language
        oneDark,
        yCollab(ytext, provider.awareness),
        EditorView.theme({
          '&': { height: '100%', fontSize: '14px' },
          '.cm-scroller': { overflow: 'auto', fontFamily: '"Fira Code", monospace' },
          '.cm-content': { minHeight: '100%' },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      provider.destroy();
      ydoc.destroy();
    };
  }, [roomId, language]); 

  return (
    <div ref={editorRef} style={{ height: '100%', width: '100%' }} />
  );
}