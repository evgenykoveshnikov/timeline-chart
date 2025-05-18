import React from 'react'
import styles from '../App/App.module.scss'
import Timeline from '../Timeline/Timeline';
import { timelineData } from '../../data';

export default function App() {
  return (
    <div className={styles.container}>
        <Timeline data={timelineData}/>
    </div>
  )
}
