export default function LoadingState() {
	return (
		<div className="text-center text-gray-900 py-24">
			<div className="inline-block w-12 h-12 border-4 border-portainer-300/30 border-t-portainer-300 rounded-full animate-spin mb-5"></div>
			<p className="text-xl">Loading migration data...</p>
		</div>
	);
}
