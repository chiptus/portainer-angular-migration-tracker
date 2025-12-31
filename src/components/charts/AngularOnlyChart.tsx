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
	angularJS: number;
}

interface AngularOnlyChartProps {
	data: ChartDataPoint[];
}

export default function AngularOnlyChart({ data }: AngularOnlyChartProps) {
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
					domain={[150, 180]}
					stroke="#dc2626"
					tick={{ fontSize: 12 }}
					label={{
						value: "Templates Remaining",
						angle: -90,
						position: "insideLeft",
						style: { fill: "#dc2626", fontSize: 12 },
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
				<Area
					type="monotone"
					dataKey="angularJS"
					name="AngularJS Templates"
					fill="#dc2626"
					fillOpacity={0.3}
					stroke="#dc2626"
					strokeWidth={2}
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
}
