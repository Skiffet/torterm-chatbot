import { BotAvatar } from '../App'
import RenovationCard from './RenovationCard'

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end items-end gap-2">
        <div className="max-w-[75%] space-y-1.5">
          {message.image && (
            <div className="flex justify-end">
              <img
                src={message.image}
                alt="uploaded house"
                className="w-24 h-24 object-cover rounded-2xl shadow"
              />
            </div>
          )}
          <div className="bg-primary text-white px-4 py-3 rounded-2xl rounded-br-none text-sm leading-relaxed shadow-sm">
            {message.text}
          </div>
        </div>
      </div>
    )
  }

  const showCard =
    message.originalImage || message.renovatedImage || message.products?.length > 0

  return (
    <div className="flex items-start gap-3">
      <BotAvatar />
      <div className="max-w-[85%] space-y-2 min-w-0">
        <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm text-sm leading-relaxed text-gray-800">
          {message.text}
        </div>
        {showCard && (
          <RenovationCard
            originalImage={message.originalImage}
            renovatedImage={message.renovatedImage}
            products={message.products}
          />
        )}
      </div>
    </div>
  )
}
