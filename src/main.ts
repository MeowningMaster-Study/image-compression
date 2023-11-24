import { join } from 'node:path'
import * as math from 'mathjs'
import * as dct from 'transformers/discrete-cosign/index.js'
import * as wavelet from 'transformers/wavelet/index.js'
import { readImage, saveImage } from './image.js'

const imageName = 'lena.png'

const image = await readImage(join('images/input', imageName))

for (const [name, transform, dir] of [
    ['Discrete Cosign Transform', runDct, 'dct'],
    ['Wavelet Transform', runWavelet, 'wavelet'],
] as const) {
    const [duration, result] = trackTime(() => transform(image))
    console.log(`${name} (${duration}ms)`)
    await saveImage(result, join('images/output', dir, imageName))
}

function runDct(image: math.Matrix) {
    const compressed = dct.compress(image)
    return dct.decompress(compressed)
}

function runWavelet(image: math.Matrix) {
    const compressed = wavelet.compress(image)
    return wavelet.decompress(compressed)
}

function trackTime<T>(func: () => T): [number, T] {
    const start = process.hrtime.bigint()
    const result = func()
    const end = process.hrtime.bigint()

    // Convert the duration to milliseconds
    const duration = Number((end - start) / BigInt(1e6))
    return [duration, result]
}
