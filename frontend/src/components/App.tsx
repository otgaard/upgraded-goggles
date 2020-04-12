import React from "react";

import "../styles/index.css";
import MapRenderer from "./MapRenderer";

export default function App() {
    const [source, setSource] = React.useState("");
    const [coord, setCoord] = React.useState(15);

    const handleSourceChange = (value: string) => {
        setSource(value);
    }

    const fetchPage = () => {
        const http = new XMLHttpRequest();
        const url = "http://localhost:8080/page/[" + coord + ",15]";
        http.open("GET", url);
        http.send();

        http.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                const obj = JSON.parse(http.responseText);
                console.log("Response:", obj.Pos);

                handleSourceChange(obj.Img);
            }
        }
    }

    return (
        <div>
            <h1>Paged Map Renderer</h1>
            <p style={{width: 200, display: "block", float: "left"}}>
                A full stack architectural test of a Go backend serving "map" pages to a frontend in Typescript + React
                displayed in a WebGL renderer packaged with webpack and deployed with Docker.  Booyakasha.
            </p>

            <MapRenderer width={640} height={480} coord={coord} />

            <h2>Test API</h2>

            <input type="text" value={coord} onChange={e => {
                const val = e.target.value === "" ? 15 : parseInt(e.target.value);
                setCoord(val);
            }}/>

            <button onClick={() => {
                setCoord(Math.max(0, coord - 1))
                fetchPage();
            }}>
                -
            </button>

            <button onClick={() => {
                setCoord(Math.min(coord + 1, 31))
                fetchPage()
            }}>
                +
            </button>

            <button onClick={fetchPage}>
                Fetch [{coord}, 15]
            </button>

            <h3>Image</h3>

            <img src={source} alt="Fetched image"/>
        </div>
    )
}

