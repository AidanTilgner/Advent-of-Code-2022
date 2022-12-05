package day5

import java.io.File
import java.util.*

fun main() {
    val lines = getMoves(getFileInput())
    val stacks = getCrateStacks()
    getStacksAfterMoves(stacks, lines)
}

fun getFileInput(): List<String> {
    val filename = "src/main/kotlin/day5/input.txt"
    return File(filename).readLines()
}

fun getCrateStacks(): MutableList<MutableList<Char>> {
    val filename = "src/main/kotlin/day5/initial-stack.txt"
    val crateLines = File(filename).readLines()
    val stacks = mutableListOf<MutableList<Char>>()

    crateLines.forEach { l ->
        val newStack = mutableListOf<Char>()
        l.forEach { c ->
            newStack.add(c)
        }
        stacks.add(newStack)
    }

    return stacks
}

fun getMoves(lines: List<String>): List<List<Int>> {
    // each line says "move <amount> from stack <from> to stack <to>"
    val newLines = mutableListOf<List<Int>>()
    lines.forEach { l ->
        val split = l.split(" ")
        val from = split[1].toInt()
        val to = split[3].toInt()
        val amount = split[5].toInt()
        newLines.add(listOf(from, to, amount))
    }
    println("New lines: $newLines")
    return newLines
}

fun getStacksAfterMoves(stacks: MutableList<MutableList<Char>>, moves: List<List<Int>>) {
    for (move in moves) {
        val (amount, from, to) = move

        // take the specified number of crates from the front of the stack
        val crates = stacks[from - 1].takeLast(amount)
        // remove the crates from the stack
        stacks[from - 1].dropLast(amount).toMutableList().also { stacks[from - 1] = it }
        // add the crates to the end of the destination stack
        stacks[to - 1].addAll(crates)
    }

    // find the tops of each stack, uppercase and joined
    val tops = stacks.map { s -> s.last() }.joinToString("") { c -> c.uppercase(Locale.getDefault()) }
    println("Tops: $tops")
    println("Stacks: $stacks")
}