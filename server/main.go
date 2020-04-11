package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"time"
	"upgraded-goggles/server/model"
)

var templates = template.Must(template.ParseGlob("templates/*"))

func pageHandler(w http.ResponseWriter, r *http.Request) {
	coord, err := ParseCoordinate(r.URL.Path[1:])
	if err != nil {
		http.NotFound(w, r)
		return
	}

	page := model.NewPage(coord.X, coord.Y, 256, 256, 1)
	model.PrintPage(page)

	err = templates.ExecuteTemplate(w, "page.html", page)
	if err != nil {
		fmt.Println("Whoa, should not be happening")
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func main() {
	srv := &http.Server{
		Addr:         ":8080",
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 30 * time.Second,
		Handler:      nil,
	}

	if templates == nil {
		fmt.Println("Templates failed to compile")
		return
	}

	http.HandleFunc("/", pageHandler)

	log.Fatal(srv.ListenAndServe())
}
