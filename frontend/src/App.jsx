import { useState, useRef, useEffect } from 'react'
import Navbar from './components/Navbar'
import ChatMessage from './components/ChatMessage'
import ChatInput from './components/ChatInput'

const WELCOME = {
  id: 0,
  role: 'bot',
  text: "Hello! I'm Torterm AI — your home renovation assistant. Upload a photo of your house and describe what you'd like to change. I'll design a renovated version and recommend the materials from our store!",
}

export default function App() {
  const [messages, setMessages] = useState([WELCOME])
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text, imageFile) => {
    const userMsg = {
      id: Date.now(),
      role: 'user',
      text,
      image: imageFile ? URL.createObjectURL(imageFile) : null,
    }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      let data
      if (imageFile) {
        const formData = new FormData()
        formData.append('message', text)
        formData.append('image', imageFile)
        const resp = await fetch('/api/chatbot/analyze/', { method: 'POST', body: formData })
        if (!resp.ok) throw new Error(`Server error ${resp.status}`)
        data = await resp.json()
      } else {
        const resp = await fetch('/api/chatbot/chat/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text }),
        })
        if (!resp.ok) throw new Error(`Server error ${resp.status}`)
        data = await resp.json()
      }

      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        text: data.analysis || data.bot_response || 'Something went wrong. Please try again.',
        products: data.products || [],
        originalImage: userMsg.image,
        renovatedImage:
          data.renovated_image
            ? `data:${data.renovated_mime || 'image/jpeg'};base64,${data.renovated_image}`
            : null,
      }
      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, role: 'bot', text: `Error: ${err.message}. Is the Django server running?` },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#EEF2FB]">
      <Navbar />

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-5">
          {messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <BotAvatar />
              <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                <div className="flex gap-1.5 items-center h-5">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  )
}

export function BotAvatar() {
  return (
    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow">
      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2M7 14v2h2v-2H7m8 0v2h2v-2h-2M4 20c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2v-2H4v2z" />
      </svg>
    </div>
  )
}
