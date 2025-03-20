import React from 'react'
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'

export const ProtectedRoutes = () => {

    const { authStatus } = useSelector((state) => state.auth)

    return authStatus ? <Outlet /> : <Navigate to="/signin" /> 
}