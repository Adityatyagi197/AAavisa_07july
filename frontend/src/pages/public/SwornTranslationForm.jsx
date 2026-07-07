import React, { useState } from 'react';
import axios from 'axios';

const SwornTranslationForm = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);

    try {
      setStatus('loading');
      setError(null);
      const res = await axios.post('http://localhost:5000/api/v1/booking/translation/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.success) {
        setQuote(res.data.data);
        setStatus('success');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setError(err.response?.data?.message || 'Failed to upload document');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Sworn Translation Quote</h2>
          <p className="mt-2 text-sm text-gray-600">Upload your PDF document to get an instant word count and estimated price.</p>
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload PDF Document</label>
            <input 
              type="file" 
              accept="application/pdf"
              required 
              onChange={handleFileChange} 
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100" 
            />
          </div>

          <div className="pt-5">
            <button
              type="submit"
              disabled={status === 'loading' || !file}
              className="w-full flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {status === 'loading' ? 'Calculating...' : 'Get Instant Quote'}
            </button>
          </div>
        </form>

        {status === 'error' && (
          <div className="mt-4 p-4 bg-red-50 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {status === 'success' && quote && (
          <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your Estimated Quote</h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Document Word Count</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">{quote.wordCount} words</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Estimated Price</dt>
                <dd className="mt-1 text-2xl font-semibold text-green-600">
                  {new Intl.NumberFormat('en-IE', { style: 'currency', currency: quote.currency }).format(quote.estimatedPrice)}
                </dd>
              </div>
            </dl>
            <div className="mt-6">
              <button className="w-full flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                Proceed with Translation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwornTranslationForm;
