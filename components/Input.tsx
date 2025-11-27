import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const TextInput: React.FC<InputProps> = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-stone-600 ml-1">{label}</label>
    <input 
      className={`w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-800 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all ${className}`}
      {...props}
    />
  </div>
);

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-stone-600 ml-1">{label}</label>
    <textarea 
      className={`w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-800 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all min-h-[120px] resize-y ${className}`}
      {...props}
    />
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string; value: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-stone-600 ml-1">{label}</label>
    <div className="relative">
      <select 
        className={`w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-800 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all appearance-none cursor-pointer ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
        <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
);