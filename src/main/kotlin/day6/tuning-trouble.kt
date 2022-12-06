package day6

import java.io.File
fun main()  {
    val lines = File("src/main/kotlin/day6/input.txt").readText()
    val amountChars = findNumCharsBeforeProtocol(lines)
    println("Amount of chars: $amountChars")
}

fun findNumCharsBeforeProtocol(chars: String): Int {
    for((i, _) in chars.withIndex()){
        if(i < 13){
            continue
        }
        val range = chars.slice(IntRange(i - 13, i))
        val isCode = detectIsNonRepeating(range)
        if(isCode){
            println("Found start signal $range")
            return i + 1
        }
    }

    return -1
}

fun detectIsNonRepeating(chars: String): Boolean {
    // go through list, checking if each character exists in the set
    val tryAgainst = mutableSetOf<Char>()

    chars.forEach { c ->
        if(tryAgainst.contains(c)){
            return false
        }
        tryAgainst.add(c)
    }

    return true
}