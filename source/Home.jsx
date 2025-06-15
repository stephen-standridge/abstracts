import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to Abstracts</h1>
      <p>Select a page to explore:</p>
      <ul>
        <li><Link to="/gmap">Gmap</Link></li>
      </ul>
    </div>
  )
}

export default Home