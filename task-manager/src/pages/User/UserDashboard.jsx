import React from 'react'
import { useUserAuth } from '../../hooks/useUserAuth'

function UserDashboard() {
  useUserAuth()
  return (
    <div>
      <h1>this the user dasboard</h1>
    </div>
  )
}

export default UserDashboard
