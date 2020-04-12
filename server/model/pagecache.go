package model

import (
	"errors"
	"fmt"
)

// PageCache stores previously created pages in a rudimentary (for now...) cache
type PageCache struct {
	cache         []*Page
	width, height int
}

func NewPageCache(width, height int) *PageCache {
	return &PageCache{
		make([]*Page, width*height),
		width,
		height,
	}
}

func (p *PageCache) Store(page *Page) error {
	if 0 <= page.Pos.X && page.Pos.X < p.width && 0 <= page.Pos.Y && page.Pos.Y < p.height {
		PrintPage(page)
		idx := page.Pos.Y*p.width + page.Pos.X
		p.cache[idx] = page
		return nil
	} else {
		return errors.New("page is out of bounds")
	}
}

func (p *PageCache) generatePage(coord Coordinate) *Page {
	return NewPage(nil, coord, 256, 256, 1)
}

func (p *PageCache) GetPage(coord Coordinate) (*Page, error) {
	if 0 <= coord.X && coord.X < p.width && 0 <= coord.Y && coord.Y < p.height {
		idx := coord.Y*p.width + coord.X
		if p.cache[idx] == nil {
			fmt.Println("Storing page in cache")
			p.cache[idx] = p.generatePage(coord)
		}
		return p.cache[idx], nil
	} else {
		return nil, errors.New("failed to cache page.  Page is out of bounds")
	}
}
