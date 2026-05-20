import type { HistoryData } from "../types";
import AngularLinesChart from "./charts/AngularLinesChart";

interface HistoryLinesChartProps {
	history: HistoryData;
}

export default function HistoryLinesChart({ history }: HistoryLinesChartProps) {
	const snapshots = history.snapshots.filter(
		(s) => s.angularJSLines !== undefined,
	);

	if (snapshots.length === 0) {
		return null;
	}

	const chartData = snapshots.map((snapshot) => ({
		date: new Date(snapshot.timestamp).toLocaleDateString("en-US", {
			month: "short",
			year: "2-digit",
		}),
		angularJSLines: snapshot.angularJSLines as number,
	}));

	const firstSnapshot = snapshots[0];
	const lastSnapshot = snapshots[snapshots.length - 1];
	const startLines = firstSnapshot.angularJSLines as number;
	const currentLines = lastSnapshot.angularJSLines as number;
	const reduction = startLines - currentLines;
	const reductionPercent = ((reduction / startLines) * 100).toFixed(1);

	const firstDate = new Date(firstSnapshot.timestamp).toLocaleDateString(
		"en-US",
		{ month: "short", year: "numeric" },
	);
	const lastDate = new Date(lastSnapshot.timestamp).toLocaleDateString(
		"en-US",
		{
			month: "short",
			year: "numeric",
		},
	);

	return (
		<div className="bg-white rounded-xl p-8 mb-8 shadow-lg border border-gray-200">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
				<div>
					<h2 className="text-2xl font-bold text-gray-900 mb-1">
						AngularJS Lines of Code Over Time
					</h2>
					<p className="text-gray-600 text-sm">
						{snapshots.length} snapshots from {firstDate} to {lastDate}
					</p>
				</div>
				<div className="text-right text-sm text-gray-600">
					<div>
						Started:{" "}
						<span className="font-semibold text-gray-900">
							{startLines.toLocaleString()}
						</span>{" "}
						lines
					</div>
					<div>
						Now:{" "}
						<span className="font-semibold text-red-600">
							{currentLines.toLocaleString()}
						</span>{" "}
						lines
					</div>
					<div>
						Removed:{" "}
						<span className="font-semibold text-green-600">
							{reduction.toLocaleString()} ({reductionPercent}%)
						</span>
					</div>
				</div>
			</div>

			<AngularLinesChart data={chartData} />
		</div>
	);
}
