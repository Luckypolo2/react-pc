import React, { useEffect, useRef } from "react"
import * as echarts from "echarts"

// eslint-disable-next-line react/prop-types
function Bar( { title, xData, yData, style } ) {
  const domRef = useRef()
  const chartInit = () => {
    const myChart = echarts.init(domRef.current)
    myChart.setOption({
      title: {
        text: title,
      },
      tooltip: {},
      xAxis: {
        data: xData,
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: yData,
        }
      ]
    })
  }
  useEffect(() => {
    chartInit()
  })
  return (
      <div>
        <div ref={domRef} style={style}></div>
      </div>
  )
}
export default Bar
