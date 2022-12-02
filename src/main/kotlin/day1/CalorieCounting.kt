package day1

import java.io.File

fun main() {
    // a readonly array of arrays of calories
    val elves = getInputFromFileContents()
    val totals = mutableListOf<Int>()

    // for each array of calories
    elves.forEach { elf ->
        totals.add(getElfTotal(elf))
    }

    println("Total calories: $totals")

    // find the top 3 totals
    val top3 = totals.sortedDescending().take(3)
    println("Top 3 totals: $top3")

    // add them together
    val result = top3.sum()

    println("The top three elves have a total of $result calories")
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