package model

import "fmt"

/*
For now the coordinate is always (0, 0), but later we will add a tileable map
*/

type Page struct {
	Pos      Coordinate // The coordinate of this tile
	Width    int
	Height   int
	Channels int
	Data     []byte // The tile data, 256 x 256
}

func NewPage(x, y, width, height, ch int) *Page {
	return &Page{
		Pos:      Coordinate{X: x, Y: y},
		Width:    width,
		Height:   height,
		Channels: ch,
		Data:     nil,
	}
}

func PrintPage(page *Page) {
	fmt.Printf("[%d,%d] %d x %d x %d\n", page.Pos.X, page.Pos.Y, page.Width, page.Height, page.Channels)
}
