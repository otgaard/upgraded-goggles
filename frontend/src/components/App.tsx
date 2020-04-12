import React from "react";

import "../styles/index.css";
import MapRenderer from "./MapRenderer";
import fetchPage from '../api/api';

export default function App() {
    const [source, setSource] = React.useState("");
    const [coordX, setCoordX] = React.useState(15);
    const [coordY, setCoordY] = React.useState(15);

    const handleSourceChange = (coord: [number, number], value: string) => {
        console.log("coord:", coord);
        setSource(value);
    }

    return (
        <div>
            <h1>Paged Map Renderer</h1>
            <p style={{width: 200, display: "block", float: "left"}}>
                A full stack architectural test of a Go backend serving "map" pages to a frontend in Typescript + React
                displayed in a WebGL renderer packaged with webpack and deployed with Docker. The display to the right is
                tiled and fetches the image data from the server.
            </p>

            <MapRenderer width={512} height={512} coord={[coordX, coordY]} />

            <h2>Test API</h2>

            <button onClick={() => {
                const val = coordX - 1
                setCoordX(val)
                fetchPage([val, coordY], handleSourceChange);
            }}>
                left
            </button>

            <button onClick={() => {
                const val = coordX + 1
                setCoordX(val)
                fetchPage([val, coordY], handleSourceChange);
            }}>
                right
            </button>

            <button onClick={() => {
                const val = coordY + 1
                setCoordY(val)
                fetchPage([coordX, val], handleSourceChange);
            }}>
                up
            </button>

            <button onClick={() => {
                const val = coordY - 1
                setCoordY(val)
                fetchPage([coordX, val], handleSourceChange);
            }}>
                down
            </button>

            <h3>Coordinate: [{coordX},{coordY}]</h3>

            <h3>Image</h3>

            <img src={source} alt="Fetched image"/>
        </div>
    )
}

