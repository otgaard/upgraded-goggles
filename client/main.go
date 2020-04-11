package main

import (
	"fmt"
	"io/ioutil"
	"math/rand"
	"net/http"
	"strconv"
	"time"
)

type Coordinate struct {
	X, Y int
}

func coordToString(coord Coordinate) string {
	return "[" + strconv.Itoa(coord.X) + "," + strconv.Itoa(coord.Y) + "]"
}

func NewCoordinate(x, y int) *Coordinate {
	return &Coordinate{
		x,
		y,
	}
}

func worker(client *http.Client, jobs <-chan Coordinate, results chan<- int) {
	for coord := range jobs {
		coordStr := coordToString(coord)
		resp, err := client.Get("http://localhost:8080/page/" + coordStr)
		if err != nil {
			fmt.Println("Error: " + err.Error())
			continue
		} else {
			fmt.Println("Starting job " + coordStr)
			buf, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				fmt.Println("Error: " + err.Error())
				continue
			}

			l := len(string(buf))

			fmt.Println("Received: " + strconv.Itoa(l))
			results <- l
			err = resp.Body.Close()
			if err != nil {
				fmt.Println("Error: " + err.Error())
			}
		}
	}
}

func singleGET(client *http.Client) {
	resp, err := client.Get("http://localhost:8080/page/[0,0]")
	if err != nil {
		fmt.Println("Failed to get URL")
		return
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	fmt.Println(string(body))
}

func main() {
	transport := &http.Transport{
		MaxIdleConns:    20,
		IdleConnTimeout: 30 * time.Second,
	}

	client := &http.Client{
		Timeout:   30 * time.Second,
		Transport: transport,
	}

	singleGET(client)

	const jobCount = 20   // We're going to do 200000 requests for pages to get an idea of scaling
	const workerCount = 5 // Over 5 workers

	jobs := make(chan Coordinate, jobCount)
	results := make(chan int, jobCount)

	for w := 0; w < workerCount; w++ {
		go worker(client, jobs, results)
	}

	for j := 0; j != jobCount; j++ {
		jobs <- Coordinate{X: rand.Intn(31), Y: rand.Intn(31)}
	}

	close(jobs)

	for r := 0; r < jobCount; r++ {
		res := <-results
		fmt.Println("Result: " + strconv.Itoa(res))
	}
}
