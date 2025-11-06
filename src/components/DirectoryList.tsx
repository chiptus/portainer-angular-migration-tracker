interface DirectoryListProps {
  byDirectory: Record<string, number>
}

export default function DirectoryList({ byDirectory }: DirectoryListProps) {
  const sortedDirs = Object.entries(byDirectory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)

  return (
    <div className="bg-white rounded-xl p-8 mb-8 shadow-xl">
      <h2 className="text-2xl font-bold mb-5 text-gray-800">
        Top Directories by AngularJS File Count
      </h2>

      <div className="space-y-3">
        {sortedDirs.map(([dir, count]) => (
          <div
            key={dir}
            className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
          >
            <div className="text-indigo-600 font-mono text-sm">
              {dir || '(root)'}
            </div>
            <div className="font-bold text-purple-700">
              {count} files
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
