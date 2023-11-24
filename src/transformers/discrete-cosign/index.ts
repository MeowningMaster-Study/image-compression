import * as math from 'mathjs'
import { clipMatrixTo8bit } from 'transformers/helpers.js'
import { N, T } from './constants.js'
import { LengthEncoded, decodeLength, encodeLength } from './length-encoding.js'
import { qualityMatrix } from './quality-matrix.js'
import { fromZigzag, toZigzag } from './zigzag.js'

type EncodedImage = [number, ...LengthEncoded[][]]

export function compress(image: math.Matrix, quality = 50) {
    assertCompressParameters(image, quality)

    const [height, width] = image.size()

    const q = qualityMatrix(quality)

    const encodedImage: EncodedImage = [quality]
    for (let blockI = 0; blockI < height; blockI += N) {
        const encodedRow: LengthEncoded[] = []
        for (let blockJ = 0; blockJ < width; blockJ += N) {
            const block = math.subset(
                image,
                math.index(
                    math.range(blockI, blockI + N),
                    math.range(blockJ, blockJ + N),
                ),
            ) as math.Matrix

            const m = math.subtract(block, 128)
            const d = math.multiply(math.multiply(T, m), math.transpose(T))
            const c = math.round(math.dotDivide(d, q) as math.Matrix)
            const encodedBlock = encodeLength(toZigzag(c))

            encodedRow.push(encodedBlock)
        }
        encodedImage.push(encodedRow)
    }

    return encodedImage
}
function assertCompressParameters(image: math.Matrix, quality: number) {
    const [height, width] = image.size()
    if (height % N !== 0 || width % N !== 0) {
        throw new Error(
            `Image size must be divisible by ${N} (got ${height}x${width})`,
        )
    }

    if (quality < 1 || quality > 100) {
        throw new Error(`Quality must be between 1 and 100 (got ${quality})`)
    }
}

export function decompress(encodedImage: EncodedImage): math.Matrix {
    const [quality, ...encodedRows] = encodedImage
    const q = qualityMatrix(quality)
    const image = math.zeros(
        encodedRows.length * N,
        encodedRows[0].length * N,
    ) as math.Matrix
    const [height, width] = image.size()

    for (let blockI = 0; blockI < height; blockI += N) {
        const encodedRow = encodedRows[blockI / N]
        for (let blockJ = 0; blockJ < width; blockJ += N) {
            const encodedBlock = encodedRow[blockJ / N]
            const c = fromZigzag(decodeLength(encodedBlock), N)
            const r = math.dotMultiply(q, c)
            const m = math.multiply(math.multiply(math.transpose(T), r), T)
            const n = clipMatrixTo8bit(
                math.round(math.add(m, 128) as math.Matrix),
            )

            image.subset(
                math.index(
                    math.range(blockI, blockI + N),
                    math.range(blockJ, blockJ + N),
                ),
                n,
            )
        }
    }

    return image
}
