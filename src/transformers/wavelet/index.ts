import * as math from 'mathjs'
import { clipMatrixTo8bit } from 'transformers/helpers.js'
import { h as _h } from './h.js'

const EPS = 1e-10

export function compress(
    image: math.Matrix,
    compressionRatio = 1.5,
): math.Matrix {
    assertCompressParameters(image, compressionRatio)

    const [size] = image.size()

    const h = _h(size)
    const hT = math.transpose(h)
    const b = math.multiply(math.multiply(hT, image), h)

    const bFlat = math.flatten(b)
    const nonZero = Math.round(
        math.count(math.filter(bFlat, (x) => math.abs(x) > EPS)) /
            compressionRatio,
    )
    const toZero = b.size()[0] * b.size()[1] - nonZero

    const sortedIndices = argsort(bFlat.toArray() as number[])
    for (let i = 0; i < toZero; i++) {
        bFlat.set([sortedIndices[i]], 0)
    }

    return math.reshape(bFlat, b.size())
}

function assertCompressParameters(image: math.Matrix, quality: number) {
    const [height, width] = image.size()

    if (height !== width) {
        throw new Error('height !== width')
    }

    if (!isPowerOf2(height)) {
        throw new Error('The size must be a power of two')
    }
}

function isPowerOf2(x: number) {
    return x && !(x & (x - 1))
}

function argsort(arr: number[]) {
    const indices = [...arr.keys()]
    return indices.sort((a, b) => arr[a] - arr[b])
}

export function decompress(encodedImage: math.Matrix): math.Matrix {
    const [size] = encodedImage.size()
    const h = _h(size)
    const hT = math.transpose(h)

    const decompressed = math.multiply(
        math.multiply(math.inv(hT), encodedImage),
        math.inv(h),
    )

    return clipMatrixTo8bit(math.round(decompressed))
}
