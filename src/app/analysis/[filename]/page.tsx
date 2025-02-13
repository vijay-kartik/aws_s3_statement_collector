'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';

interface AnalysisData {
  analysis?: string;
  error?: string;
}

export default function AnalysisPage() {
  const { filename } = useParams();
  const [analysis, setAnalysis] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        // Construct API URL using window.location.origin to ensure correct base URL in production
        const baseUrl = window.location.origin;
        const apiUrl = `${baseUrl}/api/s3-csv?filename=${encodeURIComponent(filename as string)}`;
        console.log('Fetching from:', apiUrl); // Debug log
        
        const response = await fetch(apiUrl, {
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          throw new Error(`Expected JSON response but got ${contentType}`);
        }

        const data: AnalysisData = await response.json();
        
        if (data.analysis) {
          setAnalysis(data.analysis);
        } else {
          throw new Error('No analysis data received');
        }
      } catch (error) {
        const errorMessage = error instanceof Error 
          ? `Error: ${error.message}` 
          : 'Failed to load analysis';
        console.error('Fetch error:', error);
        setError(`Failed to fetch analysis data. ${errorMessage}. Please ensure the API is properly configured.`);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [filename]);

  const renderAnalysis = () => {
    try {
      const cleanedAnalysis = analysis
        .replace(/^```json\n/, '')
        .replace(/\n```$/, '');
      
      const parsedAnalysis = JSON.parse(cleanedAnalysis);
      
      if (parsedAnalysis && typeof parsedAnalysis === 'object' && 'table' in parsedAnalysis) {
        // Get headers from the keys of the first object
        const tableData = parsedAnalysis.table;
        const headers = Object.keys(tableData[0]);
        
        return (
          <div>
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  {headers.map((header: string, index: number) => (
                    <th key={index} className="border border-gray-300 px-4 py-2">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row: Record<string, string>, rowIndex: number) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {headers.map((header: string, cellIndex: number) => (
                      <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                        {row[header]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      
      return JSON.stringify(parsedAnalysis, null, 2);
    } catch (e) {
      console.error('Error:', e);
      return analysis;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Analysis Results for {filename}</h1>
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg shadow">
          <h2 className="text-red-600 font-semibold mb-2">Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Analysis Results for {filename}</h1>
      <div className="bg-gray-50 p-6 rounded-lg shadow">
        <pre className="whitespace-pre-wrap font-mono text-sm text-black">
          {renderAnalysis()}
        </pre>
      </div>
    </div>
  );
} 