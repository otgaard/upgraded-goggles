export default function fetchPage(val: number, cb: (str: string) => void): void {
    const http = new XMLHttpRequest();
    const url = "http://localhost:8080/page/[" + val + ",15]";
    http.open("GET", url);
    http.send();

    http.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            const obj = JSON.parse(http.responseText);
            cb(obj.Img);
        }
    }
}
