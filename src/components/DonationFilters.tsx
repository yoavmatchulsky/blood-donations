export interface DonationFilterValues {
  dateFrom: string;
  dateTo: string;
  city: string;
}

interface DonationFiltersProps {
  filters: Partial<DonationFilterValues>;
  cities: string[];
  onChange: (filters: Partial<DonationFilterValues>) => void;
}

const inputClasses =
  "border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-colors";

export function DonationFilters({ filters, cities, onChange }: DonationFiltersProps) {
  const hasActiveFilters = !!filters.city;

  const update = (patch: Partial<DonationFilterValues>) =>
    onChange({ ...filters, ...patch });

  return (
    <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50" dir="rtl">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">מתאריך</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => update({ dateFrom: e.target.value })}
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">עד תאריך</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => update({ dateTo: e.target.value })}
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">עיר</label>
          <select
            value={filters.city}
            onChange={(e) => update({ city: e.target.value })}
            className={`${inputClasses} min-w-[160px]`}
          >
            <option value="">כל הערים</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        {hasActiveFilters && (
          <button
            onClick={() => onChange({ city: '' })}
            className="text-sm text-red-600 hover:text-red-800 font-medium pb-2 transition-colors cursor-pointer"
          >
            נקה סינון ✕
          </button>
        )}
      </div>
    </div>
  );
}
