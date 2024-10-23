"use client"
import React from 'react'
import withAuth from '@/components/withAuth'
import Dashboard from '@/components/Dashboard'

const page = () => {
  return (
  <Dashboard/>
  )
}

export default withAuth(page)
