package model

import "math"

func Clampi(value, min, max int) int {
	if value < min {
		return min
	}
	if value > max {
		return max
	}
	return value
}

func Clampf(value, min, max float32) float32 {
	if value < min {
		return min
	}
	if value > max {
		return max
	}
	return value
}

type Vector2i struct {
	X, Y int
}

type Vector2f struct {
	X, Y float32
}

type Vector2d struct {
	X, Y float64
}

type Vector3i struct {
	X, Y, Z int
}

type Vector3f struct {
	X, Y, Z float32
}

type Vector3d struct {
	X, Y, Z float64
}

type Vector4i struct {
	X, Y, Z, W int
}

type Vector4f struct {
	X, Y, Z, W float32
}

type Vector4d struct {
	X, Y, Z, W float64
}

func (v Vector2i) Add(w Vector2i) Vector2i {
	return Vector2i{
		v.X + w.X,
		v.Y + w.Y,
	}
}

func (v Vector2f) Add(w Vector2f) Vector2f {
	return Vector2f{
		v.X + w.X,
		v.Y + w.Y,
	}
}

func (v Vector2i) Sub(w Vector2i) Vector2i {
	return Vector2i{
		v.X - w.X,
		v.Y - w.Y,
	}
}

func (v Vector2f) Sub(w Vector2f) Vector2f {
	return Vector2f{
		v.X - w.X,
		v.Y - w.Y,
	}
}

func (v Vector2i) Mul(s int) Vector2i {
	return Vector2i{
		v.X * s,
		v.Y * s,
	}
}

func (v Vector2f) Mul(s float32) Vector2f {
	return Vector2f{
		v.X * s,
		v.Y * s,
	}
}

func (v Vector2i) Dot(w Vector2i) int {
	return v.X*w.X + v.Y*w.Y
}

func (v Vector2f) Dot(w Vector2f) float32 {
	return v.X*w.X + v.Y*w.Y
}

func (v Vector2f) Normalise() Vector2f {
	invLen := 1. / math.Sqrt(float64(v.Dot(v)))
	return Vector2f{
		float32(float64(v.X) * invLen),
		float32(float64(v.Y) * invLen),
	}
}

func (v Vector2f) Perp() Vector2f {
	return Vector2f{
		-v.Y,
		v.X,
	}
}

func Lerpf(v, w, u float32) float32 {
	return (1.-u)*v + u*w
}

func Lerp2f(v, w Vector2f, u float32) Vector2f {
	du := 1. - u
	return Vector2f{
		du*v.X + u*w.X,
		du*v.Y + u*w.Y,
	}
}

func Bilinearf(P00, P01, P10, P11, u, v float32) float32 {
	return Lerpf(Lerpf(P00, P01, u), Lerpf(P10, P11, u), v)
}

func Bilinear2f(P00, P01, P10, P11 Vector2f, u, v float32) Vector2f {
	return Lerp2f(Lerp2f(P00, P01, u), Lerp2f(P10, P11, u), v)
}
