import { mkdir } from 'fs/promises'
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
await saveImage(image, paths.output)
