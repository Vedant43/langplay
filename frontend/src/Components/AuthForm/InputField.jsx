import React from 'react'

export const InputField = ({label, placeholder, icon, type, id, value, setFormData}) => {
  return (
    <div 
      className='mb-3'
    >
        <div 
          className='flex gap-1 items-center'
        >
          <p 
            className='flex mb-1'
          >
            {icon}
          </p>
          <label
              className='block text-sm font-medium text-gray-700 mb-1 '
          >
            {label} 
          </label>  
        </div>      
        
        <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition duration-150 ease-in-out"
            type={type}
            value={value}
            id={id}
            placeholder={placeholder}
            onChange={(e) => setFormData((prev) => (
              { ...prev, [id]:e.target.value}))
            } 
            required
        />
    </div>
  )
}

