package day1

import java.io.File

fun main() {
    // a readonly array of arrays of calories
    val elves = getInputFromFileContents()

    var currentMost = 0
    var currentElf = 0

    for ((idx, elf) in elves.withIndex()) {
        val elfTotal = getElfTotal(elf)
        println("Elf ${idx + 1} has ${getElfTotal(elf)} calories")
        if (elfTotal > currentMost) {
            currentMost = elfTotal
            currentElf = idx
        }
    }

    println("The elf with the most calories is elf ${currentElf + 1} with $currentMost calories")
}

fun getElfTotal(elf: MutableList<Int>): Int {
    var total = 0

    for (c in elf) {
        total += c
    }

    return total
}

fun getInputFromFileContents(): MutableList<MutableList<Int>> {
    val fileName = "src/main/kotlin/day1/input.txt"
    val lines = File(fileName).readLines()
    val elves: MutableList<MutableList<Int>> = mutableListOf()


    if(lines.isNotEmpty()){
        elves.add(mutableListOf())
        var currIdx = 0
        lines.forEachIndexed { index, l ->
            println("Current index is $currIdx")
            println("Line at index $index value is $l")

            if(elves[currIdx].isEmpty()){
                elves.add(mutableListOf())
            }

            if(l != "") {
                elves[currIdx].add(l.toInt())
            } else {
                currIdx++
            }
        }
    }

    return elves
}