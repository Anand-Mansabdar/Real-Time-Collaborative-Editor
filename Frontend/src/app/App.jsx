import React, { useMemo, useRef } from "react";
import "./App.css";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";

const App = () => {
  const editorRef = useRef(null);
  const ydoc = useMemo(() => new Y.Doc(), []);
  const ytext = useMemo(() => ydoc.getText("monaco"), [ydoc]);

  const handleMount = (editor) => {
    editorRef.current = editor;

    const provider = new SocketIOProvider(
      "http://localhost:3000",
      "monaco",
      ydoc,
      {
        autoConnect: true
      }
    );

    const monacoBinding = new MonacoBinding(
      ytext,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness,
    );
  };

  return (
    <main className="h-screen w-full bg-neutral-950 text-amber-50 flex gap-4 p-4">
      <aside className="h-full w-1/4 bg-rose-400 rounded-lg"></aside>

      <section className="w-3/4 h-full bg-rose-500 rounded-lg overflow-hidden">
        <Editor
          height={"100%"}
          defaultLanguage="javascript"
          defaultValue="// Start writing here"
          theme="vs-dark"
          onMount={handleMount}
        />
      </section>
    </main>
  );
};

export default App;
