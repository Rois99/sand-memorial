export default function StatsBar({ stats }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl border border-sand-200 p-5 text-center shadow-sm"
        >
          <p className="text-3xl font-bold text-sand-900">{stat.value}</p>
          <p className="text-sand-500 text-sm mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
