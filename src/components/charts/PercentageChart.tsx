import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

interface ChartDataPoint {
	date: string;
	progressPercent: number;
}

interface PercentageChartProps {
	data: ChartDataPoint[];
}

export default function PercentageChart({ data }: PercentageChartProps) {
	return (
		<ResponsiveContainer width="100%" height={400}>
			<AreaChart data={data}>
				<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
				<XAxis
					dataKey="date"
					stroke="#6b7280"
					tick={{ fontSize: 12 }}
					interval={Math.floor(data.length / 10)}
				/>
				<YAxis
					domain={[85, 95]}
					stroke="#6b7280"
					tick={{ fontSize: 12 }}
					label={{
						value: "Progress (%)",
						angle: -90,
						position: "insideLeft",
						style: { fontSize: 12 },
					}}
				/>
				<Tooltip
					contentStyle={{
						backgroundColor: "#fff",
						border: "1px solid #e5e7eb",
						borderRadius: "8px",
					}}
					formatter={(value: number | undefined) =>
						value !== undefined ? `${value.toFixed(1)}%` : ""
					}
				/>
				<Legend wrapperStyle={{ paddingTop: "20px" }} />
				<Area
					type="monotone"
					dataKey="progressPercent"
					name="Migration Progress"
					fill="#13bea6"
					fillOpacity={0.3}
					stroke="#13bea6"
					strokeWidth={2}
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
}
