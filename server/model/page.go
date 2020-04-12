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
	data     []byte // The tile data, 256 x 256
	Img      string // base64 encoded string
}

const twoPi = 2.0 * math.Pi

// This function translates a sine wave in the x axis by the specified coordinate so that we can tile a
// basic image before we move to a fuller implementation
func translateWave(x, y, c, r, w, h int) byte {
	theta := 3. * (float64(x) + float64(c)/float64(w))
	omega := 9. * (float64(y) + float64(r)/float64(h))
	return byte(.25 * (math.Sin(theta) + 1. + math.Sin(omega) + 1.) * 255.)
}

func valueNoise(x, y, c, r, w, h int, perlin *Perlin) byte {
	fx := 10. * (float32(x) + float32(c)/float32(w))
	fy := 30. * (float32(y)/3. + float32(r)/float32(h))
	return byte(.5 * (perlin.ValueNoise(fx, fy) + 1.) * 255.)
}

// We'll generate a sine wave for now
func NewPage(perlin *Perlin, coord Coordinate, width, height, ch int) *Page {
	data := make([]byte, width*height)
	img := image.NewRGBA(image.Rect(0, 0, width, height))

	idx := 0
	for r := 0; r != height; r++ {
		for c := 0; c != width; c++ {
			//data[idx] = translateWave(coord.X, coord.Y, c, r, width, height)
			data[idx] = valueNoise(coord.X, coord.Y, c, r, width, height, perlin)
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
		data:     data,
		Img:      output,
	}
}

func PrintPage(page *Page) {
	fmt.Printf("[%d,%d] %d x %d x %d\n", page.Pos.X, page.Pos.Y, page.Width, page.Height, page.Channels)
}
