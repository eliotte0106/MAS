import { buildUrl } from '@/lib/utils'
import { Requests } from '@/types'
import React from 'react'
import { DataTable } from './data-table'
import { columns } from './columns'

async function RequestTable() {
    const requests = await fetch(buildUrl('request'),{
        cache: 'no-cache'
    })
    const requestsJson: Requests[] = await requests.json()
    console.log(requestsJson)
  return (
    <DataTable 
      columns={columns}
      data={requestsJson}
    />

  )
}

export default RequestTable