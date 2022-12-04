package day4

import java.io.File
fun main() {
    val lines = getFileInput()
    val total = findAmount(lines)

    println("Total amount of ranges containing the other is $total")
    println("Total number of lines: ${lines.size}")
}

fun getFileInput(): List<String> {
    val filename = "src/main/kotlin/day4/input.txt"
    return File(filename).readLines()
}

fun checkRangeContainsOther(r1: String, r2: String): Boolean {
    // check range 1 contains range 2
    val firstNumbers = r1.split('-')
    val secondNumbers = r2.split('-')

    println("First number: ${firstNumbers[1].toInt()}. Second number: ${secondNumbers[0].toInt()}")

    if(firstNumbers[1].toInt() >= secondNumbers[0].toInt() && firstNumbers[0].toInt() <= secondNumbers[1].toInt()){
        println("True")
        return true
    }

    return false
}

fun findAmount(lines: List<String>): Int {
    var amount = 0

    lines.forEach { l ->
        val (r1, r2) = l.split(',')
        if(checkRangeContainsOther(r1, r2) || checkRangeContainsOther(r2, r1)) {
            amount++
        }
    }

    return amount
}