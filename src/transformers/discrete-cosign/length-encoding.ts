export type LengthEncoded = [number, number?][]

export function encodeLength(data: number[]) {
    const encodedData: LengthEncoded = []
    let currentNum = data[0]
    let count = 1

    for (const num of data.slice(1)) {
        if (num === currentNum) {
            count += 1
        } else {
            if (count === 1) {
                encodedData.push([currentNum])
            } else {
                encodedData.push([currentNum, count])
            }
            currentNum = num
            count = 1
        }
    }

    encodedData.push([currentNum, count])
    return encodedData
}

export function decodeLength(encodedData: [number, number?][]): number[] {
    const data: number[] = []

    for (const elem of encodedData) {
        if (elem.length === 1) {
            data.push(elem[0])
        } else {
            const [num, count] = elem
            data.push(...Array(count).fill(num))
        }
    }

    return data
}
