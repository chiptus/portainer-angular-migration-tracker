import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import type { HistoryData } from "../types";

interface HistoryChartProps {
	history: HistoryData;
}

export default function HistoryChart({ history }: HistoryChartProps) {
	const chartData = history.snapshots.map((snapshot) => ({
		date: new Date(snapshot.timestamp).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "2-digit",
		}),
		"AngularJS Templates": snapshot.angularJSTemplates,
		"React Files": snapshot.reactFiles,
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

	return (
		<div className="bg-white rounded-xl p-8 mb-8 shadow-lg border border-gray-200">
			<h2 className="text-2xl font-bold mb-2 text-gray-900">
				Migration Progress Over Time
			</h2>
			<p className="text-gray-600 text-sm mb-6">
				{history.snapshots.length} snapshots from {firstDate} to {lastDate}
			</p>

			<ResponsiveContainer width="100%" height={400}>
				<LineChart data={chartData}>
					<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
					<XAxis
						dataKey="date"
						stroke="#6b7280"
						tick={{ fontSize: 12 }}
						interval={Math.floor(chartData.length / 10)}
					/>
					<YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
					<Tooltip
						contentStyle={{
							backgroundColor: "#fff",
							border: "1px solid #e5e7eb",
							borderRadius: "8px",
						}}
					/>
					<Legend wrapperStyle={{ paddingTop: "20px" }} />
					<Line
						type="monotone"
						dataKey="AngularJS Templates"
						stroke="#dc2626"
						strokeWidth={2}
						dot={false}
						activeDot={{ r: 6 }}
					/>
					<Line
						type="monotone"
						dataKey="React Files"
						stroke="#13bea6"
						strokeWidth={2}
						dot={false}
						activeDot={{ r: 6 }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
