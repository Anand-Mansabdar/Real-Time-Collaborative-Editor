import React from 'react'
import "./App.css"
import {Editor} from "@monaco-editor/react"

const App = () => {
  return (
    <main className='h-screen w-full bg-neutral-950 text-amber-50 flex gap-4 p-4'>
      <aside className='h-full w-1/4 bg-rose-400 rounded-lg'>
      </aside>

      <section className='w-3/4 h-full bg-rose-500 rounded-lg overflow-hidden'>
        <Editor height={"100%"} defaultLanguage='javascript' defaultValue='// Start writing here' theme='vs-dark' />
      </section>
    </main>
  )
}

export default App