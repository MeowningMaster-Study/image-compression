import * as math from 'mathjs'
import { N } from './constants.js'

export function toZigzag(matrix: math.Matrix): number[] {
    const zigzagList: number[] = []

    for (let i = 0; i < 2 * N - 1; i++) {
        if (i % 2 === 0) {
            for (let j = Math.max(0, i - N + 1); j <= Math.min(i, N - 1); j++) {
                zigzagList.push(matrix.get([i - j, j]))
            }
        } else {
            for (let j = Math.max(0, i - N + 1); j <= Math.min(i, N - 1); j++) {
                zigzagList.push(matrix.get([j, i - j]))
            }
        }
    }

    return zigzagList
}

export function fromZigzag(zigzagList: number[], n: number): math.Matrix {
    const matrix = math.zeros(n, n) as math.Matrix
    let count = 0

    for (let i = 0; i < 2 * n - 1; i++) {
        if (i % 2 === 0) {
            for (let j = Math.max(0, i - n + 1); j <= Math.min(i, n - 1); j++) {
                matrix.set([i - j, j], zigzagList[count])
                count++
            }
        } else {
            for (let j = Math.max(0, i - n + 1); j <= Math.min(i, n - 1); j++) {
                matrix.set([j, i - j], zigzagList[count])
                count++
            }
        }
    }

    return matrix
}
