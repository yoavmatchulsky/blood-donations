import React from 'react';
import { useBloodDonations } from '../hooks';
import { BloodDonationsTable } from '../components/BloodDonationsTable';

export const Home: React.FC = () => {
  const { data, loading, error, refetch } = useBloodDonations();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-rose-50 to-white" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-gradient-to-l from-red-700 to-red-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6 flex items-center justify-center gap-3">
          <span className="text-3xl">🩸</span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            עמדות תרומת דם
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-red-200 border-t-red-600"></div>
            <p className="mt-4 text-gray-500 text-lg">טוען נתונים...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl mb-6 shadow-sm">
            <p className="font-bold text-lg">שגיאה</p>
            <p className="mt-1">{error}</p>
            <button
              onClick={refetch}
              className="mt-3 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              נסה שוב
            </button>
          </div>
        )}

        {data && <BloodDonationsTable data={data} />}

        {!loading && !error && !data && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">אין נתונים זמינים</p>
            <button
              onClick={refetch}
              className="mt-4 bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              טען נתונים
            </button>
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-xs text-gray-400 space-y-1">
        <div className="mb-2">
          <p>הנתונים מוצגים כפי שנלקחו ממד"א ואינם בבעלות מפעילי האתר.</p>
          <p>השימוש באתר הוא על אחריות המשתמש בלבד.</p>
        </div>
        <div>
          <a href="https://www.mdais.org/blood-donation" target="_blank" rel="noopener noreferrer" className="hover:text-red-600">מד"א - מגן דוד אדום</a>
          <span className="mx-2">|</span>
          <a href="https://yoavi.codes/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600">יואבי</a>
        </div>
      </footer>
    </div>
  );
};
