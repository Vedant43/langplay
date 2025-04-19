import React from 'react'

export const InputField = ({ label, placeholder, icon, type, id, register, errors }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={id}>
          {label}
        </label>
      )}

      <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
        <span className="text-gray-500 mr-2">{icon}</span>
        <input
          {...register(id, { required: `${id} is required` })}
          type={type}
          id={id}
          placeholder={placeholder}
          className="flex-1 text-sm text-gray-700 bg-transparent outline-none"
        />
      </div>

      {errors[id] && (
        <span className="text-red-400 text-xs mt-1 block">
          {errors[id].message}
        </span>
      )}
    </div>
  );
};


