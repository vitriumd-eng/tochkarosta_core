'use client';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error('Global Error:', error); }, [error]);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-xl font-bold text-red-600">Что-то пошло не так!</h2>
      <button onClick={() => reset()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Попробовать снова
      </button>
    </div>
  );
}