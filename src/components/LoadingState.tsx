export default function LoadingState() {
  return (
    <div className="text-center text-white py-24">
      <div className="inline-block w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-5"></div>
      <p className="text-xl">Loading migration data...</p>
    </div>
  )
}
