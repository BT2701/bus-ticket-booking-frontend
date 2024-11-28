
import { ResponsivePie } from '@nivo/pie'
import React from 'react';
import { convertDataForPieChart } from "./Convertdata";
import axios from 'axios';
import { useEffect, useState } from 'react';

const PieChart = ({ data, totalLablel }) => {
  // const [PieData, setPieData] = useState([]);
  // const [total, setToTal] = useState();
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:8080/api/statistic/tinhtrangve`);
  //       const labels = ["Đã thanh toán", "Chưa thanh toán"];
  //       setPieData(convertDataForPieChart(response.data, labels));
  //       setToTal(convertDataForPieChart(response.data, labels).reduce((acc, item) => acc + item.value, 0))
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  //   fetchData();

  // }, [])

  return (
    <div style={{ height: 200 }}>
      <ResponsivePie
        data={data}
        tooltip={({ datum }) => (
          <div
            style={{
              background: 'white',
              padding: '5px 10px',
              border: '1px solid #ccc',
            }}
          >
            <strong>{datum.id}</strong>: {datum.value} (
            {((datum.value / totalLablel) * 100).toFixed(2)}%)
          </div>
        )}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
          from: 'color',
          modifiers: [
            [
              'darker',
              0.2
            ]
          ]
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: 'color',
          modifiers: [
            [
              'darker',
              2
            ]
          ]
        }}
        defs={[
          {
            id: 'dots',
            type: 'patternDots',
            background: 'inherit',
            color: 'rgba(255, 255, 255, 0.3)',
            size: 4,
            padding: 1,
            stagger: true
          },
          {
            id: 'lines',
            type: 'patternLines',
            background: 'inherit',
            color: 'rgba(255, 255, 255, 0.3)',
            rotation: -45,
            lineWidth: 6,
            spacing: 10
          }
        ]}
        fill={[
          {
            match: {
              id: 'ruby'
            },
            id: 'dots'
          },
          {
            match: {
              id: 'c'
            },
            id: 'dots'
          },
          {
            match: {
              id: 'go'
            },
            id: 'dots'
          },
          {
            match: {
              id: 'python'
            },
            id: 'dots'
          },
          {
            match: {
              id: 'scala'
            },
            id: 'lines'
          },
          {
            match: {
              id: 'lisp'
            },
            id: 'lines'
          },
          {
            match: {
              id: 'elixir'
            },
            id: 'lines'
          },
          {
            match: {
              id: 'javascript'
            },
            id: 'lines'
          }
        ]}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: '#999',
            itemDirection: 'left-to-right',
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000'
                }
              }
            ]
          }
        ]}
      />
    </div>
  );
}


export default PieChart;