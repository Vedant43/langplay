import React from 'react'

export const InputField = ({label, placeholder, icon, type, id, register, errors}) => {
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
            className={`w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary  transition duration-150 ease-in-out ${errors[id] ? `focus:border-red-950 focus:outline-red-700` : `focus:outline-primary`}`}
            type={type}
            id={id}
            placeholder={placeholder}
            {...register(id, {
              required: `${id} is required`
            })}
        />

          {errors[id] && (
            <span className='text-red-400 text-xs mt-1 text-balance block break-words'>
              {errors[id].message}
            </span>
          )
        }
    </div>
  )
}

