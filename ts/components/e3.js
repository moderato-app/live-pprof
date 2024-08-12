import * as echarts from 'echarts'

export function abcd() {
  var chartDom = document.getElementById('xxx')
  var myChart = echarts.init(chartDom)
  var option

  const dataCount = 5e5
  const data = generateData(dataCount)
  option = {
    title: {
      text: echarts.format.addCommas(dataCount) + ' Data',
      left: 10,
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: false,
        },
        saveAsImage: {
          pixelRatio: 2,
        },
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      bottom: 90,
    },
    dataZoom: [
      {
        type: 'inside',
      },
      {
        type: 'slider',
      },
    ],
    xAxis: {
      data: data.categoryData,
      silent: false,
      splitLine: {
        show: false,
      },
      splitArea: {
        show: false,
      },
    },
    yAxis: {
      splitArea: {
        show: false,
      },
    },
    series: [
      {
        type: 'bar',
        data: data.valueData,
        // Set `large` for large data amount
        large: true,
      },
    ],
  }

  function generateData(count) {
    let baseValue = Math.random() * 1000
    let time = +new Date(2011, 0, 1)
    let smallBaseValue

    function next(idx) {
      smallBaseValue = idx % 30 === 0 ? Math.random() * 700 : smallBaseValue + Math.random() * 500 - 250
      baseValue += Math.random() * 20 - 10
      return Math.max(0, Math.round(baseValue + smallBaseValue) + 3000)
    }

    const categoryData = []
    const valueData = []
    for (let i = 0; i < count; i++) {
      categoryData.push(echarts.format.formatTime('yyyy-MM-dd\nhh:mm:ss', time, false))
      valueData.push(next(i).toFixed(2))
      time += 1000
    }
    return {
      categoryData: categoryData,
      valueData: valueData,
    }
  }

  option && myChart.setOption(option)
}
