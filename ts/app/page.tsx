import { Suspense } from 'react'

import { AllGraphs } from '@/components/all-graphs'

export default function Home() {
  return (
    <Suspense>
      <AllGraphs />
    </Suspense>
  )
}
