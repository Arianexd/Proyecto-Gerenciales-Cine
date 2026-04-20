'use client';

import { useState } from 'react';

interface PaymentFormProps {
  totalAmount: number;
  onSubmit: (paymentData: {
    cardNumber: string;
    cardholderName: string;
    expiryDate: string;
    cvv: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export default function PaymentForm({ totalAmount, onSubmit, isSubmitting }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: ''
  });

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card Number - Cinema Style */}
      <div>
        <label className="block text-yellow-400 font-black text-sm mb-2 tracking-wider">
          NÚMERO DE TARJETA *
        </label>
        <div className="relative">
          <input
            type="text"
            required
            maxLength={19}
            value={formData.cardNumber}
            onChange={(e) => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
            className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white font-mono text-lg focus:outline-none focus:border-red-500 transition-colors pr-14"
            placeholder="1234 5678 9012 3456"
          />
          <div className="absolute right-3 top-3 text-gray-500">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Cardholder Name */}
      <div>
        <label className="block text-yellow-400 font-black text-sm mb-2 tracking-wider">
          NOMBRE DEL TITULAR *
        </label>
        <input
          type="text"
          required
          value={formData.cardholderName}
          onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value.toUpperCase() })}
          className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white font-semibold focus:outline-none focus:border-red-500 transition-colors uppercase"
          placeholder="JUAN PÉREZ"
        />
      </div>

      {/* Expiry Date and CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-yellow-400 font-black text-sm mb-2 tracking-wider">
            FECHA DE EXPIRACIÓN *
          </label>
          <input
            type="text"
            required
            maxLength={5}
            value={formData.expiryDate}
            onChange={(e) => setFormData({ ...formData, expiryDate: formatExpiryDate(e.target.value) })}
            className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white font-mono text-lg focus:outline-none focus:border-red-500 transition-colors"
            placeholder="MM/AA"
          />
        </div>

        <div>
          <label className="block text-yellow-400 font-black text-sm mb-2 tracking-wider">
            CVV *
          </label>
          <input
            type="text"
            required
            maxLength={3}
            value={formData.cvv}
            onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
            className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white font-mono text-lg focus:outline-none focus:border-red-500 transition-colors"
            placeholder="123"
          />
        </div>
      </div>

      {/* Demo Notice - Cinema Style */}
      <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
        <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <div className="text-sm text-yellow-400">
          <p className="font-bold mb-1 tracking-wider">MODO DEMO</p>
          <p className="text-gray-400">Esto es una demostración. Tu información de pago no se almacena ni procesa.</p>
        </div>
      </div>

      {/* Submit Button - Cinema CTA */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-700 disabled:to-gray-800 text-white font-black text-xl py-5 rounded-xl transition-all duration-300 shadow-2xl shadow-green-500/50 disabled:shadow-none transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-7 w-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="tracking-wider">PROCESANDO PAGO...</span>
          </>
        ) : (
          <>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="tracking-wider">PAGAR ${totalAmount.toFixed(2)}</span>
          </>
        )}
      </button>
    </form>
  );
}
