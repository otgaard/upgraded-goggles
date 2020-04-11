package main

import (
	"errors"
	"fmt"
	"regexp"
	"strconv"
	"upgraded-goggles/server/model"
)

var coordRegex = regexp.MustCompile("^\\[([0-9]+),([0-9]+)]$")

// Parse a coordinate from an input URL
func ParseCoordinate(url string) (*model.Coordinate, error) {
	match := coordRegex.FindStringSubmatch(url)
	if match == nil {
		fmt.Println("No Match: " + url)
		return nil, errors.New("invalid page coordinate")
	} else {
		x, err := strconv.Atoi(match[1])
		if err != nil {
			fmt.Println("Failed x coord: " + match[1])
			return nil, errors.New("invalid page coordinate")
		}

		y, err := strconv.Atoi(match[2])
		if err != nil {
			fmt.Println("Failed y coord: " + match[2])
			return nil, errors.New("invalid page coordnate")
		}

		return &model.Coordinate{
			X: x,
			Y: y,
		}, nil
	}
}
