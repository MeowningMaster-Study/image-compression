import { mkdir } from 'fs/promises'
import * as math from 'mathjs'
import * as dct from 'transformers/discrete-cosign/index.js'
import { readImage, saveImage } from './image.js'

const imageName = 'lena.png'
const dirs = {
    input: 'images/input',
    output: 'images/output',
}
const paths = {
    input: `${dirs.input}/${imageName}`,
    output: `${dirs.output}/${imageName}`,
}

await mkdir(dirs.output, { recursive: true })

const image = await readImage(paths.input)
const dctCompressed = dct.compress(math.matrix(image))
const dctDecompressed = dct.decompress(dctCompressed).toArray() as number[][]
await saveImage(dctDecompressed, paths.output)
