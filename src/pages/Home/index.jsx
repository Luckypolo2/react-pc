import React from "react"
import Bar from "@/components/Bar"

function Home () {
  return (
    <div>
      <Bar title={'主流框架使用满意度'}
           xData={[ 'react','vue', 'angular' ]}
           yData={[ 30,40,50 ]} style={{ width:'500px', height:'400px' }}></Bar>
    </div>
  )
}
export default Home
