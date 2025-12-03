export default function loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Task planning</h2>
          <p className="opacity-70">Загружаем страницу...</p>
        </div>

        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce "
            style={{ animationDelay: '0.1s' }}
          ></div>
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
          ></div>
        </div>
      </div>
    </div>
  )
}