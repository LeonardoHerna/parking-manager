
export default function Card({ title, value, color, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-500">{title}</h2>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <p className={`text-6xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
