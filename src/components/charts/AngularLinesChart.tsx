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
	angularJSLines: number;
}

interface AngularLinesChartProps {
	data: ChartDataPoint[];
}

export default function AngularLinesChart({ data }: AngularLinesChartProps) {
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
					stroke="#dc2626"
					tick={{ fontSize: 12 }}
					label={{
						value: "Lines of Code",
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
					formatter={(value: number | undefined) => [
						(value ?? 0).toLocaleString(),
						"AngularJS Lines",
					]}
				/>
				<Legend wrapperStyle={{ paddingTop: "20px" }} />
				<Area
					type="monotone"
					dataKey="angularJSLines"
					name="AngularJS Lines of Code"
					fill="#dc2626"
					fillOpacity={0.3}
					stroke="#dc2626"
					strokeWidth={2}
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
}
