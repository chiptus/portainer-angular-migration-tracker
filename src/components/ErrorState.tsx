interface ErrorStateProps {
	message: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
	return (
		<div className="bg-red-50 border-2 border-red-300 text-red-800 p-6 rounded-xl mb-8 text-center shadow-lg">
			<h2 className="text-2xl font-bold mb-3">⚠️ Data Not Available</h2>
			<p className="mb-3">{message}</p>
			<p className="text-sm bg-red-200 inline-block px-4 py-2 rounded">
				Run the analysis script:{" "}
				<code className="font-mono">npm run analyze</code>
			</p>
		</div>
	);
}
