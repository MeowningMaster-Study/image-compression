import * as math from 'mathjs'

export const N = 8

export const Q50 = math.matrix([
    [16, 11, 10, 16, 24, 40, 51, 61],
    [12, 12, 14, 19, 26, 58, 60, 55],
    [14, 13, 16, 24, 40, 57, 69, 56],
    [14, 17, 22, 29, 51, 87, 80, 62],
    [18, 22, 37, 56, 68, 109, 103, 77],
    [24, 35, 55, 64, 81, 104, 113, 92],
    [49, 64, 78, 87, 103, 121, 120, 101],
    [72, 92, 95, 98, 112, 100, 103, 99],
])

const a = 1 / Math.sqrt(N)
const b = Math.sqrt(2 / N)

export const T = math.matrix(
    math.zeros(N, N).map((_, index) => {
        const [i, j] = index as [number, number]
        if (i === 0) {
            return a
        } else {
            return b * math.cos(((2 * j + 1) * i * Math.PI) / (2 * N))
        }
    }) as math.MathCollection,
)
