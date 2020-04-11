package model

import "errors"

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

func (p *PageCache) generatePage(x, y int) *Page {
	return NewPage(x, y, 256, 256, 1)
}

func (p *PageCache) GetPage(x, y int) (*Page, error) {
	if 0 <= x && x < p.width && 0 <= y && y < p.height {
		idx := y*p.width + x
		if p.cache[idx] == nil {
			p.cache[idx] = p.generatePage(x, y)
		}
		return p.cache[idx], nil
	} else {
		return nil, errors.New("failed to cache page.  Page is out of bounds")
	}
}
