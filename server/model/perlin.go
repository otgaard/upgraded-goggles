package model

import (
	"math"
	"math/rand"
)

/*
A Perlin noise model written from scratch, based on Ken Perlin's original implementation
*/

type Perlin struct {
	Seed       int64
	permTable  []int
	floatTable []float32
	vec2Table  []Vector2f
}

const tableSize = 256
const mask = tableSize - 1

func NewPerlin(seed int64) *Perlin {
	rand.Seed(seed)

	permTable := make([]int, tableSize)
	floatTable := make([]float32, tableSize)
	vec2Table := make([]Vector2f, tableSize)

	for i := 0; i != tableSize; i++ {
		permTable[i] = i
		floatTable[i] = rand.Float32()
		vec2Table[i] = Vector2f{X: rand.Float32(), Y: rand.Float32()}.Normalise()
	}

	// Shuffle the permutation table
	for i := 0; i != tableSize; i++ {
		idx := rand.Intn(mask)
		y := permTable[idx]
		permTable[idx] = permTable[i]
		permTable[i] = y
	}

	return &Perlin{
		seed,
		permTable,
		floatTable,
		vec2Table,
	}
}

func (p Perlin) perm(x, y int) int {
	return p.permTable[(x+p.permTable[byte(y&mask)])&mask]
}

func (p Perlin) grad(x, y int) float32 {
	return p.floatTable[p.perm(x, y)]
}

func (p Perlin) ValueNoise(u, v float32) float32 {
	ui := int(math.Floor(float64(u)))
	vi := int(math.Floor(float64(v)))
	du := u - float32(ui)
	dv := v - float32(vi)
	return Bilinearf(p.grad(ui, vi), p.grad(ui+1, vi),
		p.grad(ui, vi+1), p.grad(ui+1, vi+1),
		du, dv)
}
