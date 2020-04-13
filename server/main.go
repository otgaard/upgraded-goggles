package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"
	"upgraded-goggles/server/model"
)

//var templates = template.Must(template.ParseGlob("templates/*"))
var perlin = model.NewPerlin(0)

func pageHandler(pageCache *model.PageCache, w http.ResponseWriter, r *http.Request) {
	coord, err := ParseCoordinate(r.URL.Path[len("/page/"):])
	if err != nil {
		http.NotFound(w, r)
		return
	}

	page := model.NewPage(perlin, *coord, 256, 256, 1)

	/*
		No Caching for now
		page, err := pageCache.GetPage(*coord)
		if err != nil {
			http.NotFound(w, r)
			return
		}
	*/

	model.PrintPage(page)

	json.NewEncoder(w).Encode(page)
	/*
		err = templates.ExecuteTemplate(w, "page.html", page)
		if err != nil {
			fmt.Println("Whoa, should not be happening")
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		fmt.Fprintln(w, "<img src=\""+page.Img+"\" />")
	*/
}

func makeHandler(pageCache *model.PageCache, fn func(*model.PageCache, http.ResponseWriter, *http.Request)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		pageHandler(pageCache, w, r)
	}
}

func main() {
	srv := &http.Server{
		Addr:         ":8081",
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 30 * time.Second,
		Handler:      nil,
	}

	A := model.Vector2i{X: 1, Y: 2}
	B := model.Vector2i{X: 2, Y: -3}

	fmt.Println("X: " + strconv.Itoa(A.Sub(B).X) + ", Y: " + strconv.Itoa(A.Mul(12).Y))

	pageCache := model.NewPageCache(32, 32)
	http.HandleFunc("/page/", makeHandler(pageCache, pageHandler))
	http.Handle("/", http.FileServer(http.Dir("www")))

	log.Fatal(srv.ListenAndServe())
}
