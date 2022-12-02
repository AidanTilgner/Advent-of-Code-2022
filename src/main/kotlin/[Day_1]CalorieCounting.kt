fun main() {
    // a readonly array of arrays of calories
    val calories = arrayOf(
        arrayOf(1000, 2000, 3000),
        arrayOf(4000),
        arrayOf(5000, 6000),
        arrayOf(7000, 8000, 9000),
        arrayOf(10000)
    )

    var currentMost = 0
    var currentElf = 0

    for ((idx, elf) in calories.withIndex()) {
        val elfTotal = getElfTotal(elf)
        println("Elf ${idx + 1} has ${getElfTotal(elf)} calories")
        if (elfTotal > currentMost) {
            currentMost = elfTotal
            currentElf = idx
        }
    }

    println("The elf with the most calories is elf ${currentElf + 1} with $currentMost calories")
}

fun getElfTotal(elf: Array<Int>): Int {
    var total = 0

    for (c in elf) {
        total += c
    }

    return total
}