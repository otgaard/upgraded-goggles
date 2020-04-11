package model

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"image"
	"image/png"
	"math"
)

type Page struct {
	Pos      Coordinate // The coordinate of this tile
	Width    int
	Height   int
	Channels int
	Data     []byte // The tile data, 256 x 256
	Img      string // base64 encoded string
}

const twoPi = 2.0 * math.Pi

// We'll generate a sine wave for now
func NewPage(coord Coordinate, width, height, ch int) *Page {
	data := make([]byte, width*height)
	img := image.NewRGBA(image.Rect(0, 0, width, height))

	idx := 0
	for r := 0; r != height; r++ {
		for c := 0; c != width; c++ {
			data[idx] = byte((.5 * (math.Sin(twoPi*float64(c)/float64(width)) + 1.0)) * 255.)
			for ch := 0; ch != 3; ch++ {
				img.Pix[4*idx+ch] = data[idx]
			}
			img.Pix[4*idx+3] = 255
			idx++
		}
	}

	var buffer bytes.Buffer
	if err := png.Encode(&buffer, img); err != nil {
		fmt.Println("Failed to encode image")
		return nil
	}
	output := "data:image/png;base64," + base64.StdEncoding.EncodeToString(buffer.Bytes())

	return &Page{
		Pos:      coord,
		Width:    width,
		Height:   height,
		Channels: ch,
		Data:     data,
		Img:      output,
	}
}

func PrintPage(page *Page) {
	fmt.Printf("[%d,%d] %d x %d x %d\n", page.Pos.X, page.Pos.Y, page.Width, page.Height, page.Channels)
}
