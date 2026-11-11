import { NavLink } from 'react-router-dom';
import type { ProductionItem } from '../types/production';

const STATIONS = [
  { id: 1, name: 'Station 1' },
  { id: 2, name: 'Station 2' },
  { id: 3, name: 'Station 3' },
];

export default function StationTabs({ items = [] }: { items?: ProductionItem[] }) {
  return (
    <div className="border-b border-slate-200">
      <nav className="flex space-x-2">
        {STATIONS.map((station) => {
          const count = items.filter((item) => item.station === station.id).length;
          return (
            <NavLink
              key={station.id}
              to={`/station/${station.id}`}
              className={({ isActive }) =>
                `-mb-px px-5 py-3 text-sm font-semibold rounded-t-lg border-b-2 transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="w-2 h-2 rounded-full bg-current" />
                  <span>{station.name}</span>
                  {items.length > 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
