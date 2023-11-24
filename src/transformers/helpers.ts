import * as math from 'mathjs'

export function clipMatrixTo8bit(value: math.Matrix) {
    return clipMatrix(value, 1, 255)
}

export function clipMatrix(value: math.Matrix, min: number, max: number) {
    return math.map(value, (x) => clip(x, min, max))
}

export function clip(value: number, min: number, max: number) {
    return math.min(max, math.max(min, value))
}
