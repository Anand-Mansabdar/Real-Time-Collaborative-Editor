import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";

const App = () => {
  const [userName, setUserName] = useState(() => {
    return new URLSearchParams(window.location.search).get("username") || "";
  });
  const [users, setUsers] = useState([]);

  const editorRef = useRef(null);
  const ydoc = useMemo(() => new Y.Doc(), []);
  const ytext = useMemo(() => ydoc.getText("monaco"), [ydoc]);

  const handleMount = (editor) => {
    editorRef.current = editor;
    new MonacoBinding(
      ytext,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
    );
  };

  const handleJoin = (e) => {
    e.preventDefault();
    setUserName(e.target.username.value);
    window.history.pushState({}, "", "?username=" + e.target.username.value);
  };

  useEffect(() => {
    if (userName) {
      const provider = new SocketIOProvider(
        "/",
        "monaco",
        ydoc,
        {
          autoConnect: true,
        },
      );

      provider.awareness.setLocalStateField("user", { username: userName });

      const states = Array.from(provider.awareness.getStates().values());
      setUsers(
        states
          .filter((state) => state.user && state.user.username)
          .map((state) => state.user),
      );

      provider.awareness.on("change", () => {
        const states = Array.from(provider.awareness.getStates().values());
        setUsers(
          states
            .filter((state) => state.user && state.user.username)
            .map((state) => state.user),
        );
      });

      const handleBeforeUnload = () => {
        provider.awareness.setLocalStateField("user", null);
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        provider.disconnect();
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [userName]);

  if (!userName) {
    return (
      <main className="h-screen w-full bg-neutral-900 flex gap-4 p-4 items-center justify-center">
        <form onSubmit={handleJoin}>
          <input
            type="text"
            placeholder="Enter Username"
            className="p-2 rounded-lg bg-neutral-800 text-white"
            name="username"
          />

          <button className="p-2 rounded-lg bg-amber-50 text-neutral-950 font-bold">
            Join
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="h-screen w-full bg-neutral-950 text-amber-50 flex gap-4 p-4">
      <aside className="h-full w-1/4 bg-rose-400 rounded-lg">
        <h2 className="text-2xl font-bold p-4 border-b border-gray-300">
          Users
        </h2>
        <ul className="p-4">
          {users.map((user, index) => (
            <li
              key={index}
              className="p-2 bg-neutral-800 text-white rounded mb-2"
            >
              {user.username}
            </li>
          ))}
        </ul>
      </aside>

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
