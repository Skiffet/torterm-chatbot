import { useState, useRef } from 'react'

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const uploadRef = useRef(null)
  const cameraRef = useRef(null)

  const handleFile = (file) => {
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    setImage(null)
    setPreview(null)
    if (uploadRef.current) uploadRef.current.value = ''
    if (cameraRef.current) cameraRef.current.value = ''
  }

  const handleSend = () => {
    if (disabled || (!text.trim() && !image)) return
    onSend(text.trim(), image)
    setText('')
    removeImage()
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const canSend = !disabled && (text.trim() || image)

  return (
    <div className="bg-white border-t border-gray-100 px-4 pt-3 pb-4 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
      <div className="max-w-2xl mx-auto">
        {/* Image preview */}
        {preview && (
          <div className="flex items-center gap-3 mb-2 px-1">
            <img src={preview} alt="preview" className="w-12 h-12 object-cover rounded-lg shadow-sm" />
            <span className="text-xs text-gray-500 truncate flex-1">{image?.name}</span>
            <button
              onClick={removeImage}
              className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
            >
              Remove
            </button>
          </div>
        )}

        {/* Main input row */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 focus-within:border-primary focus-within:bg-white transition-colors">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type additional renovation request..."
            disabled={disabled}
            className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!canSend}
            className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white px-5 py-1.5 rounded-xl text-sm font-semibold transition-colors"
          >
            Send
          </button>
        </div>

        {/* Photo buttons */}
        <div className="flex gap-6 mt-2.5 px-1">
          {/* Upload Photo */}
          <input
            ref={uploadRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <button
            onClick={() => uploadRef.current?.click()}
            disabled={disabled}
            className="flex items-center gap-1.5 text-gray-400 hover:text-primary disabled:opacity-40 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span className="text-xs font-medium">Upload Photo</span>
          </button>

          {/* Take Photo */}
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <button
            onClick={() => cameraRef.current?.click()}
            disabled={disabled}
            className="flex items-center gap-1.5 text-gray-400 hover:text-primary disabled:opacity-40 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs font-medium">Take Photo</span>
          </button>
        </div>
      </div>
    </div>
  )
}
