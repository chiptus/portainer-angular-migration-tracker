import { Summary } from '../types'

interface StatsCardsProps {
  summary: Summary
}

export default function StatsCards({ summary }: StatsCardsProps) {
  const totalComponents =
    summary.componentRegistrations +
    summary.directiveRegistrations +
    summary.controllerRegistrations +
    summary.serviceRegistrations +
    summary.factoryRegistrations +
    summary.filterRegistrations

  const totalFiles = summary.totalAngularJSFiles + summary.totalReactFiles

  const cards = [
    { title: 'React Files', value: summary.totalReactFiles, highlight: true },
    { title: 'AngularJS Files', value: summary.totalAngularJSFiles, highlight: true },
    { title: 'Total Files', value: totalFiles, highlight: false },
    { title: 'Total Components', value: totalComponents, highlight: false },
    { title: 'Controller Files', value: summary.controllerFiles, highlight: false },
    { title: 'Service Files', value: summary.serviceFiles, highlight: false },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-xl p-6 shadow-xl hover:transform hover:-translate-y-1 transition-all duration-300"
        >
          <div className="text-sm text-gray-600 uppercase tracking-wide mb-2">
            {card.title}
          </div>
          <div
            className={`font-bold ${
              card.highlight
                ? 'text-5xl text-purple-700'
                : 'text-4xl text-indigo-600'
            }`}
          >
            {card.value}
          </div>
        </div>
      ))}
    </div>
  )
}
