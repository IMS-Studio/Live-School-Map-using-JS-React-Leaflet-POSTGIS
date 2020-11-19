import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useState } from 'react'

import SchoolList from '../components/schools'

const NoSSRMap = dynamic(() => import('../components/map'), {
  ssr: false
})

export default function Home() {
  const [schools, setSchools] = useState([])
  const [activeSchool, setActiveSchool] = useState()

  const onMapViewChange = (bbox) => {
    fetch('/api/schools', { method: 'POST', body: JSON.stringify({ bbox }) })
      .then((res) => res.json())
      .then((data) => setSchools(data))
  }

  return (
    <>
      <Head>
        <title>LiveBy School Explorer</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.css"
        />
      </Head>

      <main>
        <NoSSRMap
          items={schools}
          activeItem={activeSchool}
          onSelectItem={setActiveSchool}
          onViewChange={onMapViewChange}
        />
        <SchoolList
          items={schools}
          activeItem={activeSchool}
          onSelectItem={setActiveSchool}
        />
      </main>
      <style jsx>{`
        main {
          display: flex;
        }
      `}</style>
    </>
  )
}
