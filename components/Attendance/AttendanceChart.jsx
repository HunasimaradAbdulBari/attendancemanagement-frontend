import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const AttendanceChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const chart = echarts.init(chartRef.current);
    
    // Process data for chart
    const dates = data.map(record => new Date(record.date).toLocaleDateString());
    const attendanceStatus = data.map(record => record.status === 'present' ? 1 : 0);
    
    // Calculate running percentage
    let presentCount = 0;
    const percentages = attendanceStatus.map((status, index) => {
      presentCount += status;
      return Math.round((presentCount / (index + 1)) * 100);
    });

    const option = {
      title: {
        text: 'Attendance Trend',
        left: 'center',
        textStyle: {
          fontSize: 16,
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          const date = params[0].axisValue;
          const percentage = params[0].value;
          const status = attendanceStatus[params[0].dataIndex] ? 'Present' : 'Absent';
          return `Date: ${date}<br/>Status: ${status}<br/>Overall: ${percentage}%`;
        }
      },
      xAxis: {
        type: 'category',
        data: dates.slice(-10), // Show last 10 records
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          name: 'Attendance %',
          type: 'line',
          data: percentages.slice(-10),
          smooth: true,
          itemStyle: {
            color: '#10b981'
          },
          areaStyle: {
            color: 'rgba(16, 185, 129, 0.1)'
          },
          markLine: {
            data: [
              {
                yAxis: 75,
                name: '75% Requirement',
                lineStyle: {
                  color: '#ef4444',
                  type: 'dashed'
                },
                label: {
                  formatter: '75% Required'
                }
              }
            ]
          }
        }
      ],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      }
    };

    chart.setOption(option);

    // Cleanup
    return () => {
      chart.dispose();
    };
  }, [data]);

  return <div ref={chartRef} style={{ width: '100%', height: '300px' }} />;
};

export default AttendanceChart;