import { Summary } from "../types";

interface StatsCardsProps {
  summary: Summary;
}

export default function StatsCards({ summary }: StatsCardsProps) {
  const cards = [
    {
      title: "AngularJS Templates",
      value: summary.totalAngularJSTemplates,
      highlight: true,
    },
    {
      title: "React Components",
      value: summary.totalReactFiles,
      highlight: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:border-portainer-200 transition-all duration-300"
        >
          <div className="text-sm text-gray-900 opacity-60 uppercase tracking-wide mb-2">
            {card.title}
          </div>
          <div
            className={`font-bold ${
              card.highlight
                ? "text-5xl text-portainer-300"
                : "text-4xl text-gray-900"
            }`}
          >
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
