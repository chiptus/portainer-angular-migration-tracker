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
	angularJS: number;
	react: number;
}

interface DualAxisChartProps {
	data: ChartDataPoint[];
}

export default function DualAxisChart({ data }: DualAxisChartProps) {
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
				<YAxis
					yAxisId="left"
					domain={[150, 180]}
					stroke="#dc2626"
					tick={{ fontSize: 12 }}
					label={{
						value: "AngularJS",
						angle: -90,
						position: "insideLeft",
						style: { fill: "#dc2626", fontSize: 12 },
					}}
				/>
				<YAxis
					yAxisId="right"
					orientation="right"
					domain={[1300, 1850]}
					stroke="#13bea6"
					tick={{ fontSize: 12 }}
					label={{
						value: "React",
						angle: 90,
						position: "insideRight",
						style: { fill: "#13bea6", fontSize: 12 },
					}}
				/>
				<Tooltip
					contentStyle={{
						backgroundColor: "#fff",
						border: "1px solid #e5e7eb",
						borderRadius: "8px",
					}}
				/>
				<Legend wrapperStyle={{ paddingTop: "20px" }} />
				<Line
					yAxisId="left"
					type="monotone"
					dataKey="angularJS"
					name="AngularJS Templates"
					stroke="#dc2626"
					strokeWidth={2}
					dot={false}
					activeDot={{ r: 6 }}
				/>
				<Line
					yAxisId="right"
					type="monotone"
					dataKey="react"
					name="React Files"
					stroke="#13bea6"
					strokeWidth={2}
					dot={false}
					activeDot={{ r: 6 }}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
}
