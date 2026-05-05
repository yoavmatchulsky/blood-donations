import { endOfDay, format, isAfter, isBefore, startOfDay } from "date-fns";
import { useMemo, useState } from "react";
import { DonationFilters, type DonationFilterValues } from "./DonationFilters";

function SortIcon({ active, direction }: { active: boolean; direction: string; }) {
  if (!active) return <span className="text-gray-300 mr-1">↕</span>;
  return <span className="text-red-600 mr-1">{direction === 'asc' ? '▲' : '▼'}</span>;
}

function toDateString(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

export function BloodDonationsTable({ data }: { data: any; }) {
  const [sortedBy, setSortedBy] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<string>('asc');

  const { cities, defaultFilters } = useMemo(() => {
    const unique = [...new Set<string>(data.map((d: any) => d.City))].filter(Boolean);
    const maxTime = data.reduce((max: number, d: any) => Math.max(max, new Date(d.DateDonation).getTime()), 0);
    const lastDate = maxTime ? new Date(maxTime) : new Date();
    return {
      cities: unique.sort((a, b) => a.localeCompare(b)),
      defaultFilters: {
        dateFrom: toDateString(new Date()),
        dateTo: toDateString(lastDate),
        city: '',
      } as DonationFilterValues,
    };
  }, [data]);

  const [filters, setFilters] = useState<Partial<DonationFilterValues> | null>(null);
  const activeFilters = filters ?? defaultFilters;

  const filteredAndSortedData = useMemo(() => {
    let filtered = data;

    if (activeFilters.dateFrom) {
      const from = new Date(activeFilters.dateFrom);
      filtered = filtered.filter((d: any) => isAfter(endOfDay(d.DateDonation), from));
    }
    if (activeFilters.dateTo) {
      const to = new Date(activeFilters.dateTo);
      filtered = filtered.filter((d: any) => isBefore(startOfDay(d.DateDonation), to));
    }
    if (activeFilters.city) {
      filtered = filtered.filter((d: any) => d.City === activeFilters.city);
    }

    return filtered.toSorted((a: any, b: any) => {
      let sortByValue = 0;
      switch (sortedBy) {
        case 'date': sortByValue = new Date(a.DateDonation).getTime() - new Date(b.DateDonation).getTime(); break;
        case 'city': sortByValue = a.City.localeCompare(b.City); break;
        case 'name': sortByValue = a.Name.localeCompare(b.Name); break;
        default: break;
      }
      return sortDirection === 'asc' ? sortByValue : -sortByValue;
    });
  }, [data, sortedBy, sortDirection, activeFilters]);

  const PAGE_SIZE = 50;
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(filteredAndSortedData.length / PAGE_SIZE);
  const pagedData = filteredAndSortedData.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Reset to first page when filters change
  const handleFiltersChange = (newFilters: Partial<DonationFilterValues>) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handleSort = (column: string) => {
    if (sortedBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortedBy(column);
      setSortDirection('asc');
    }
    setPage(0);
  };

  const colgroup = (
    <colgroup>
      <col className="w-[15%]" />
      <col className="w-[15%]" />
      <col className="w-[30%]" />
      <col className="w-[25%]" />
      <col className="w-[15%]" />
    </colgroup>
  );

  const statusBar = (
    <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 flex items-center justify-between" dir="rtl">
      <span className="text-xs text-gray-400">
        {filteredAndSortedData.length} עמדות תרומה | עמוד {page + 1} מתוך {totalPages || 1}
      </span>
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 text-xs font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            → הקודם
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1 text-xs font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            הבא ←
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="bg-white rounded-t-2xl shadow-lg border border-gray-100 border-b-0">
        <DonationFilters filters={activeFilters} cities={cities} onChange={handleFiltersChange} />
      </div>

      <div className="sticky top-[85px] z-10">
        <table className="w-full text-sm table-fixed bg-rose-50 shadow-sm" dir="rtl">
          {colgroup}
          <thead>
            <tr className="text-gray-700">
              <th
                className="py-4 px-4 text-right font-semibold cursor-pointer hover:bg-red-100/50 transition-colors select-none"
                onClick={() => handleSort('date')}
              >
                <span className="inline-flex items-center gap-1">תאריך <SortIcon active={sortedBy === 'date'} direction={sortDirection} /></span>
              </th>
              <th className="py-4 px-4 text-right font-semibold">שעות</th>
              <th
                className="py-4 px-4 text-right font-semibold cursor-pointer hover:bg-red-100/50 transition-colors select-none"
                onClick={() => handleSort('city')}
              >
                <span className="inline-flex items-center gap-1">מיקום <SortIcon active={sortedBy === 'city'} direction={sortDirection} /></span>
              </th>
              <th
                className="py-4 px-4 text-right font-semibold cursor-pointer hover:bg-red-100/50 transition-colors select-none"
                onClick={() => handleSort('name')}
              >
                <span className="inline-flex items-center gap-1">שם <SortIcon active={sortedBy === 'name'} direction={sortDirection} /></span>
              </th>
              <th className="py-4 px-4 text-right font-semibold"></th>
            </tr>
          </thead>
        </table>
        {statusBar}
      </div>

      <div className="bg-white border border-gray-100 border-t-0 shadow-lg">
        <table className="w-full text-sm table-fixed" dir="rtl">
          {colgroup}
          <tbody className="divide-y divide-gray-100">
            {pagedData.map((item: any, index: number) => (
              <tr
                key={item.id}
                className={`text-right transition-colors hover:bg-red-50/60 cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                onClick={() => window.open(item.SchedulingURL, '_blank')}
              >
                <td className="py-3.5 px-4 text-gray-800 font-medium">{format(item.DateDonation, 'dd/MM/yyyy')}</td>
                <td className="py-3.5 px-4 text-gray-600">{item.FromHour} - {item.ToHour}</td>
                <td className="py-3.5 px-4 text-gray-600">{item.City} {item.Street} {item.NumHour} {item.AccountType}</td>
                <td className="py-3.5 px-4 text-gray-800">{item.Name}</td>
                <td className="py-3.5 px-4">
                  <a
                    href={item.SchedulingURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-block bg-red-600 text-white text-xs font-medium px-4 py-1.5 rounded-full hover:bg-red-700 transition-colors no-underline cursor-pointer"
                  >
                    קביעת תור
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="rounded-b-2xl overflow-hidden">
          {statusBar}
        </div>
      </div>
    </div>
  );
}
