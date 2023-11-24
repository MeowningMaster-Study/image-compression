import sharp from 'sharp'

type Matrix = number[][]

function bufferToMatrix(buffer: Buffer, width: number, height: number) {
    const matrix: Matrix = []
    for (let i = 0; i < height; i++) {
        const row = []
        for (let j = 0; j < width; j++) {
            const offset = i * width + j
            row.push(buffer[offset])
        }
        matrix.push(row)
    }
    return matrix
}

export async function readImage(path: string) {
    const image = sharp(path).greyscale()

    const { width, height } = await image.metadata()
    if (!width || !height) throw new Error('Invalid image metadata')

    const buffer = await image.raw().toBuffer()
    return bufferToMatrix(buffer, width, height)
}

function matrixToBuffer(matrix: Matrix) {
    const height = matrix.length
    const width = matrix[0].length

    const buffer = Buffer.alloc(width * height)
    for (let i = 0; i < height; i++) {
        const row = matrix[i]
        for (let j = 0; j < width; j++) {
            const offset = i * width + j
            buffer[offset] = row[j]
        }
    }
    return buffer
}

export async function saveImage(matrix: Matrix, path: string) {
    const buffer = matrixToBuffer(matrix)

    const height = matrix.length
    const width = matrix[0].length
    const image = sharp(buffer, { raw: { width, height, channels: 1 } })
    await image.toFile(path)
}
