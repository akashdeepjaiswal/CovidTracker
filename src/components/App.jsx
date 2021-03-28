import React, { useEffect, useState } from "react";
import {
    MenuItem,
    FormControl,
    Select,
    Card,
    CardContent
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData } from "../util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";


function App() {

    const [countries, setCountries] = useState([]);
    //for drop down menu keep track of what got clicked
    const [country, setCountry] = useState("Worldwide");
    // for individual country
    const [countryInfo, setCountryInfo] = useState({})
    //table
    const [tableData, setTableData] = useState([])
    //MAP
    const [mapCenter, setMapCenter] = useState(
        {
            lat: 0,
            lng: 0
        }
    );
    const [mapZoom, setMapZoom] = useState(1.5);

    const [mapCountries, setMapCountries] = useState([])
    const [casesType, setCasesType] = useState("cases")

    // for initial worldwide data load as no conditiom given
    useEffect(() => {

        fetch("https://disease.sh/v3/covid-19/all")
            .then(response => response.json())
            .then(data => {
                setCountryInfo(data);
               // console.log("ALL DATA ", data);
            })

    }, [])

    useEffect(() => {
        //empty array --condition ---here loads code once after app relods
        //asyn -> source-->send request,,wait for,,,do sometinh woth onfo
        //asyn function
        const getCountriesData = async () => {
            await fetch("https://disease.sh/v3/covid-19/countries")
                .then((response) => response.json())
                .then((data) => {
                    const countries = data.map((country) => (
                        {
                            //feilds coming from api
                            name: country.country,
                            value: country.countryInfo.iso2 //UK USA
                        }
                    ));


                    //whole data which is not sorted....we want sort by cases
                    // setTableData(data);
                    const sortedData = sortData(data);
                    setTableData(sortedData);

                    setCountries(countries);
                    //all info of countries for circle
                    setMapCountries(data);

                    // console.log("coiuntries data for table", data);

                });
        };

        getCountriesData();

    }, [])

    const onCountryChange = async (event) => {
        const countryCode = event.target.value;

        //call to that county
        //https://disease.sh/v3/covid-19/all ---worldwide
        //https://disease.sh/v3/covid-19/countries/country_code

        const url = countryCode === "Worldwide" ?
            "https://disease.sh/v3/covid-19/all" :
            `https://disease.sh/v3/covid-19/countries/${countryCode}`;

        await fetch(url)
            .then(response => response.json())
            .then(data => {
                // storing whole country's data from response
                setCountryInfo(data);
                //setting to cpuntry name update input feild
                setCountry(countryCode);

                if(countryCode === "Worldwide"){
                    setMapCenter([0 ,0]);
                    setMapZoom(1.5);
                }
                else{
                    setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
                    setMapZoom(3);
                }

                

            });
    };

    // console.log("xxxxxxxxx ", countryInfo)

    return (
        <div className="app">

            <div className="app__left">
                {/* header */}
                {/* title+input dropdown field */}
                <div className="app__header">
                    <h1> COVID-19 TRACKER </h1>
                    <FormControl className="app_dropdown">
                        <Select
                            variant="outlined"
                            value={country}
                            onChange={onCountryChange}>
                            {/* loop through all countires and show dropdown */}
                            <MenuItem value="Worldwide">Worlwide</MenuItem>
                            {
                                countries.map((country) => (
                                    <MenuItem value={country.value}>{country.name}</MenuItem>
                                ))
                            }
                        </Select>

                    </FormControl>
                </div>


                {/* info box  covid cases*/}
                <div className="app__stats">

                    
                    <InfoBox
                    isRed 
                    active={casesType === "cases"}
                    onClick={(e)=>setCasesType("cases")}
                    title="Coroavirus Cases" total={countryInfo.cases} cases={countryInfo.todayCases} />
                    {/* info box  covid cases*/}
                    <InfoBox 
                    active={casesType === "recovered"}
                    onClick={(e)=>setCasesType("recovered")}
                    title="Recoverd" total={countryInfo.recovered} cases={countryInfo.todayRecovered} />
                    {/* info box recpovery */}
                    <InfoBox 
                    isRed
                    active={casesType === "deaths"}
                    onClick={(e)=>setCasesType("deaths")}
                    title="Death" total={countryInfo.deaths} cases={countryInfo.todayDeaths} />
                    {/* info box */}

                </div>

                {/* map */}

                <Map
                    casesType={casesType}
                    center={mapCenter}
                    zoom={mapZoom}
                    countries={mapCountries}
                />

            </div>

            {/* table */}

            <Card className="app__right">

                <CardContent>

                    <h3>Live Cases by country</h3>
                    <Table countries={tableData} />
                    
                    {/* graph */}
                    <h3>Worldwide New { casesType} </h3>
                    <LineGraph casesType={casesType} />
                </CardContent>
            </Card>
        </div>
    );
}

export default App;