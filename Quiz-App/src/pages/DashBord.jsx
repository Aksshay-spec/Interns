import React from 'react'
import Testcard from "../components/Testcard"
import Header from '../components/Header'

export const DashBord = ({setPage,setTopic}) => {
 
  return (<>
   <Header />
    <div className='dashboard-container'>
     
      

      <Testcard topic="React" questions="5" setTopic={setTopic}  setPage={setPage}/>
      <Testcard topic="HTML" questions="5" setTopic={setTopic}  setPage={setPage}/>
      <Testcard topic="JavaScript" questions="5" setTopic={setTopic}  setPage={setPage}/>
      
    </div>
  </>
  )
}
export default DashBord
