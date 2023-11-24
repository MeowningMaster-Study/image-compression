import * as math from 'mathjs'
import { clipMatrixTo8bit } from 'transformers/helpers.js'
import { Q50 } from './constants.js'

export function qualityMatrix(quality: number) {
    let q

    if (quality === 50) {
        q = Q50
    } else if (quality > 50) {
        q = math.multiply(Q50, (100 - quality) / 50)
    } else {
        q = math.multiply(Q50, 50 / quality)
    }

    q = clipMatrixTo8bit(math.round(q))

    return q
}
