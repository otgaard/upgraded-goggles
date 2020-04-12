import React from "react";

import "../styles/index.css";
import MapRenderer from "./MapRenderer";
import fetchPage from '../api/api';

export default function App() {
    const [source, setSource] = React.useState("");
    const [coord, setCoord] = React.useState(15);

    const handleSourceChange = (value: string) => {
        setSource(value);
    }

    return (
        <div>
            <h1>Paged Map Renderer</h1>
            <p style={{width: 200, display: "block", float: "left"}}>
                A full stack architectural test of a Go backend serving "map" pages to a frontend in Typescript + React
                displayed in a WebGL renderer packaged with webpack and deployed with Docker.
            </p>

            <MapRenderer width={640} height={480} coord={[coord, 15]} />

            <h2>Test API</h2>

            <button onClick={() => {
                const val = Math.max(0, coord - 1)
                setCoord(val)
                fetchPage(val, handleSourceChange);
            }}>
                -
            </button>

            <button onClick={() => {
                const val = Math.min(coord + 1, 31)
                setCoord(val)
                fetchPage(val, handleSourceChange);
            }}>
                +
            </button>

            <h3>Coordinate: [{coord},15]</h3>

            <h3>Image</h3>

            <img src={source} alt="Fetched image"/>
        </div>
    )
}

