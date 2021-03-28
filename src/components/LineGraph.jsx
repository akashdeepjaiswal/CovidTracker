import { rgbToHex } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import "../LineGraph.css"

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
};


function LineGraph({casesType="cases"}) {
    const [data, setData] = useState({});
    //https://disease.sh/v3/covid-19/historical/all?lastdays=30

    const buildChartData = (data, casesType = "cases") => {
        let chartData = [];
        let lastDataPoint;

        //lopp through all of data
        // data[casesType].forEach( (date) => { ---forEach not work beacause its not array
        for (let date in data.cases) {
            if (lastDataPoint) {
                let newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                };
                chartData.push(newDataPoint);
            }

            lastDataPoint = data['cases'][date];
        }

        return chartData;
    }

    useEffect(() => {
        const fetchData = async () => {

            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
                .then(response => response.json())
                .then((data) => {
                    //graph
                    // console.log("line grsph data",data);
                    let chartData = buildChartData(data, casesType);
                    // console.log("line graph",chartData);
                    setData(chartData);
                });
        }

        fetchData();
    }, [casesType])


    return (
        <div className="line__graph">
            
            {data ?.length > 0 && (

                <Line
                    options={options}
                    data={{
                        datasets: [
                            {
                                data: data, //our data in usestate
                                backgroundColor: "rgba(204, 16, 52, 0)",
                                borderColor: "#CC1034",
                            },
                        ],
                    }}
                // options
                />
            )}

        </div>
    )
}

export default LineGraph;
