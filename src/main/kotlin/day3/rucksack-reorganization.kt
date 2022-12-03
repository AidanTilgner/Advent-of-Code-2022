package day3

import java.io.File
fun main() {
    val lines = getFileInput()
    val types = findTypesForGroups(lines)
    val priorities = types.map { t -> findCharPriority(t) }

    println("Priorities: $priorities")
    val sum = priorities.sum()

    println("The sum of the priorities of the input types is: $sum")
}

fun getFileInput(): List<String> {
    val filename = "src/main/kotlin/day3/input.txt"

    return File(filename).readLines()
}

fun findTypesForGroups(lines: List<String>): List<Char> {
    return lines.chunked(3).map { group -> findRepeatingChar(group) }
}

fun findRepeatingChar(elfGroup: List<String>): Char {
    for(ch in elfGroup[0]){
        if(elfGroup[1].contains(ch) && elfGroup[2].contains(ch)){
            return ch
        }
    }

    return '*'
}

fun findCharPriority(letter: Char): Int {
    val alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    val score = alphabet.indexOf(letter) + 1

    if(letter == 'z' || letter == 'Z'){
        println("Letter is $letter score is $score")
    }

    return score
}