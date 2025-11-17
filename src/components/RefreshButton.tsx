interface RefreshButtonProps {
  onRefresh: () => void
}

export default function RefreshButton({ onRefresh }: RefreshButtonProps) {
  return (
    <button
      onClick={onRefresh}
      className="fixed bottom-8 right-8 bg-portainer-300 text-white px-8 py-4 rounded-full text-base font-medium shadow-2xl hover:bg-portainer-500 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-portainer-200"
    >
      ↻ Refresh Data
    </button>
  )
}
