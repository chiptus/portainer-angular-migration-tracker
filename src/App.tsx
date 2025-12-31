import { useState, useEffect } from "react";
import { Results, HistoryData } from "./types";
import Header from "./components/Header";
import StatsCards from "./components/StatsCards";
import MigrationProgress from "./components/MigrationProgress";
import HistoryChart from "./components/HistoryChart";
import ModuleBreakdown from "./components/ModuleBreakdown";
import MostChangedFiles from "./components/MostChangedFiles";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";

function App() {
	const [data, setData] = useState<Results | null>(null);
	const [history, setHistory] = useState<HistoryData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadData = async (forceReload = false) => {
		if (forceReload) {
			setLoading(true);
			setError(null);
		}

		try {
			const [resultsResponse, historyResponse] = await Promise.all([
				fetch("results.json?" + Date.now()),
				fetch("history.json?" + Date.now()),
			]);

			if (!resultsResponse.ok) {
				throw new Error(
					"Results file not found. Please run the analysis script first.",
				);
			}

			const jsonData = await resultsResponse.json();
			setData(jsonData);

			if (historyResponse.ok) {
				const historyData = await historyResponse.json();
				setHistory(historyData);
			}

			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadData();

		// Auto-refresh every 5 minutes
		// const interval = setInterval(() => loadData(false), 5 * 60 * 1000)
		// return () => clearInterval(interval)
	}, []);

	return (
		<div className="min-h-screen bg-gray-50 p-5">
			<div className="max-w-7xl mx-auto">
				<Header />

				{loading && <LoadingState />}

				{error && !loading && <ErrorState message={error} />}

				{data && !loading && (
					<>
						<div className="text-center text-gray-900 mb-8 text-sm opacity-60">
							Last updated:{" "}
							{new Date(data.timestamp).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								year: "numeric",
								hour: "numeric",
								minute: "2-digit",
								hour12: true,
							})}
						</div>

						<StatsCards summary={data.summary} />
						<MigrationProgress summary={data.summary} />
						{history && <HistoryChart history={history} />}
						{data.byModule && <ModuleBreakdown byModule={data.byModule} />}
						{data.mostChangedHtmlFiles &&
							data.mostChangedHtmlFiles.length > 0 && (
								<MostChangedFiles files={data.mostChangedHtmlFiles} />
							)}
					</>
				)}
			</div>
		</div>
	);
}

export default App;
