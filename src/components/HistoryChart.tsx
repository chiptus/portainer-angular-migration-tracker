import { useState } from "react";
import type { HistoryData } from "../types";
import DualAxisChart from "./charts/DualAxisChart";
import PercentageChart from "./charts/PercentageChart";
import DeltaChart from "./charts/DeltaChart";
import AngularOnlyChart from "./charts/AngularOnlyChart";
import SingleAxisChart from "./charts/SingleAxisChart";

interface HistoryChartProps {
	history: HistoryData;
}

type ChartType =
	| "angular-only"
	| "dual-axis"
	| "percentage"
	| "delta"
	| "single-axis";

export default function HistoryChart({ history }: HistoryChartProps) {
	const [chartType, setChartType] = useState<ChartType>("angular-only");

	// Transform data for all chart types
	const chartData = history.snapshots.map((snapshot) => ({
		date: new Date(snapshot.timestamp).toLocaleDateString("en-US", {
			month: "short",
			year: "2-digit",
		}),
		angularJS: snapshot.angularJSTemplates,
		react: snapshot.reactFiles,
		progressPercent:
			(snapshot.reactFiles /
				(snapshot.reactFiles + snapshot.angularJSTemplates)) *
			100,
		removed: 391 - snapshot.angularJSTemplates,
		reactGrowth: snapshot.reactFiles - 1334,
	}));

	const firstDate = new Date(history.snapshots[0].timestamp).toLocaleDateString(
		"en-US",
		{
			month: "short",
			year: "numeric",
		},
	);
	const lastDate = new Date(
		history.snapshots[history.snapshots.length - 1].timestamp,
	).toLocaleDateString("en-US", {
		month: "short",
		year: "numeric",
	});

	const chartOptions = [
		{ value: "angular-only", label: "AngularJS Reduction" },
		{ value: "dual-axis", label: "Dual Y-Axis" },
		{ value: "percentage", label: "Migration Progress %" },
		{ value: "delta", label: "Progress Made (Delta)" },
		{ value: "single-axis", label: "Single Axis " },
	];

	const renderChart = () => {
		switch (chartType) {
			case "dual-axis":
				return <DualAxisChart data={chartData} />;
			case "percentage":
				return <PercentageChart data={chartData} />;
			case "delta":
				return <DeltaChart data={chartData} />;
			case "angular-only":
				return <AngularOnlyChart data={chartData} />;
			case "single-axis":
			default:
				return <SingleAxisChart data={chartData} />;
		}
	};

	return (
		<div className="bg-white rounded-xl p-8 mb-8 shadow-lg border border-gray-200">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
				<div>
					<h2 className="text-2xl font-bold text-gray-900 mb-1">
						Migration Progress Over Time
					</h2>
					<p className="text-gray-600 text-sm">
						{history.snapshots.length} snapshots from {firstDate} to {lastDate}
					</p>
				</div>

				<div className="flex items-center gap-2">
					<label
						htmlFor="chart-type"
						className="text-sm text-gray-600 font-medium"
					>
						View:
					</label>
					<select
						id="chart-type"
						value={chartType}
						onChange={(e) => setChartType(e.target.value as ChartType)}
						className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
					>
						{chartOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>
			</div>

			{renderChart()}
		</div>
	);
}
