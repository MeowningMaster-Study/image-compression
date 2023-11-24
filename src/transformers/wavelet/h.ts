import * as math from 'mathjs'

function h1(size: number): math.Matrix {
    const h = math.zeros(size, size) as math.Matrix

    for (let i = 0; i < size; i += 2) {
        h.set([i, i / 2], 0.5)
        h.set([i + 1, i / 2], 0.5)
    }

    for (let i = size - 1; i >= 0; i -= 2) {
        h.set([i, size - (size - i + 1) / 2], -0.5)
        h.set([i - 1, size - (size - i + 1) / 2], 0.5)
    }

    return h
}

function h2(size: number): math.Matrix {
    const h = math.zeros(size, size) as math.Matrix
    const h1Subset = math.subset(
        h1(size / 2),
        math.index(math.range(0, size / 2), math.range(0, size / 2)),
    )
    h.subset(
        math.index(math.range(0, size / 2), math.range(0, size / 2)),
        h1Subset,
    )
    h.subset(
        math.index(math.range(size / 2, size), math.range(size / 2, size)),
        math.identity(size / 2),
    )
    return h
}

function h3(size: number): math.Matrix {
    const h = math.identity(size) as math.Matrix
    h.set([0, 0], 0.5)
    h.set([0, 1], 0.5)
    h.set([1, 0], 0.5)
    h.set([1, 1], -0.5)
    return h
}

export function h(size: number): math.Matrix {
    return math.multiply(math.multiply(h1(size), h2(size)), h3(size))
}
