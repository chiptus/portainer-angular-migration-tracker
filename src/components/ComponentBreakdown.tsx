import { Summary } from '../types'

interface ComponentBreakdownProps {
  summary: Summary
}

export default function ComponentBreakdown({ summary }: ComponentBreakdownProps) {
  const totalComponents =
    summary.componentRegistrations +
    summary.directiveRegistrations +
    summary.controllerRegistrations +
    summary.serviceRegistrations +
    summary.factoryRegistrations +
    summary.filterRegistrations

  const items = [
    { label: 'Component Registrations', count: summary.componentRegistrations },
    { label: 'Directive Registrations', count: summary.directiveRegistrations },
    { label: 'Controller Registrations', count: summary.controllerRegistrations },
    { label: 'Service Registrations', count: summary.serviceRegistrations },
    { label: 'Factory Registrations', count: summary.factoryRegistrations },
    { label: 'Filter Registrations', count: summary.filterRegistrations },
  ]

  return (
    <div className="bg-white rounded-xl p-8 mb-8 shadow-xl">
      <h2 className="text-2xl font-bold mb-5 text-gray-800">Component Type Breakdown</h2>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center">
            <div className="w-52 text-sm text-gray-600">{item.label}</div>
            <div className="flex-1 bg-gray-200 rounded-md h-8 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-600 to-purple-700 h-full flex items-center px-3 text-white font-bold text-sm transition-all duration-500 ease-out"
                style={{
                  width: totalComponents > 0 ? `${(item.count / totalComponents * 100)}%` : '0%',
                }}
              >
                {item.count}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
