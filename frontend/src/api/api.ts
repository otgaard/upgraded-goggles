export default function fetchPage(coord: [number, number], cb: (coord: [number, number], str: string) => void): void {
    const http = new XMLHttpRequest();
    const url = "http://localhost:8081/page/[" + coord[0] + "," + coord[1] + "]";

    console.log("Fetching: " + url);

    http.open("GET", url);
    http.send();

    http.onreadystatechange = function() {
        if(this.readyState !== 4) return;

        if(this.status === 200) {
            const obj = JSON.parse(http.responseText);
            cb(coord, obj.Img);
        } else if(this.status === 404) {
            cb(coord, "");
        }
    };
}
