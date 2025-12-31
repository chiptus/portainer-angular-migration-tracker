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

interface ChartDataPoint {
	date: string;
	removed: number;
	reactGrowth: number;
}

interface DeltaChartProps {
	data: ChartDataPoint[];
}

export default function DeltaChart({ data }: DeltaChartProps) {
	return (
		<ResponsiveContainer width="100%" height={400}>
			<LineChart data={data}>
				<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
				<XAxis
					dataKey="date"
					stroke="#6b7280"
					tick={{ fontSize: 12 }}
					interval={Math.floor(data.length / 10)}
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
					dataKey="removed"
					name="Templates Removed"
					stroke="#dc2626"
					strokeWidth={2}
					dot={false}
					activeDot={{ r: 6 }}
				/>
				<Line
					type="monotone"
					dataKey="reactGrowth"
					name="React Files Added"
					stroke="#13bea6"
					strokeWidth={2}
					dot={false}
					activeDot={{ r: 6 }}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
}
