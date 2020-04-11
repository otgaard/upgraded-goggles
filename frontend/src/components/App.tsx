import React from "react";

import "../styles/index.css";

class App extends React.PureComponent {
    public render() {
        return (
            <div>
                Hello, World

                <button onClick={() => console.log("Hello, Typescript World!")}>
                    Click Me
                </button>
            </div>
        );
    }
}

export default App;