interface RefreshButtonProps {
  onRefresh: () => void
}

export default function RefreshButton({ onRefresh }: RefreshButtonProps) {
  return (
    <button
      onClick={onRefresh}
      className="fixed bottom-8 right-8 bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-8 py-4 rounded-full text-base font-medium shadow-2xl hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-purple-300"
    >
      ↻ Refresh Data
    </button>
  )
}
