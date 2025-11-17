export default function Header() {
  return (
    <div className="text-center mb-10">
      <div className="flex items-center justify-center gap-4 mb-4">
        <img
          src="/portainer-angular-migration-tracker/portainer-logo.png"
          alt="Portainer Logo"
          className="w-16 h-16"
        />
        <h1 className="text-5xl font-bold text-gray-900 drop-shadow-sm">
          AngularJS Migration Tracker
        </h1>
      </div>
      <p className="text-xl text-gray-900 opacity-70">
        Tracking progress toward complete React migration
      </p>
    </div>
  )
}
