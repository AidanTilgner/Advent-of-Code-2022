package day2

import java.io.File

fun main() {
    // GOAL: What would your total score be if everything goes exactly according to your strategy guide?
    val scores = getInputFromFileContents()

    // for each array of scores
    val totalScore = scores.reduce { acc, score ->
        acc + score
    }

    println("Total score: $totalScore")
}

fun getInputFromFileContents(): MutableList<Int> {
    val fileName = "src/main/kotlin/day2/input.txt"
    val lines = File(fileName).readLines()

    // each line is formatted like:
    // A Y
    // where the first letter is the opponents move and the second letter is the players move

    val scores = mutableListOf<Int>()

    if (lines.isNotEmpty()) {
        lines.forEach { l ->
            val opponentMove = l[0]
            val playerMove = l[2]

            val score = getScoreForRound(opponentMove, playerMove)
            scores.add(score)
        }
    }

    return scores
}

/**
 * A = Rock
 * B = Paper
 * C = Scissors
 *
 * X = End in Loss
 * B = End in Tie
 * C = End in Win
 */
fun getScoreForRound(opponentShape: Char, outcome: Char): Int {
    // opponentShape is either A, B, or C
    // pl is either X, Y, or Z

    val shapes = mapOf('R' to 1, 'P' to 2, 'S' to 3)
    val mapLetterToShape = mapOf(
        'A' to 'R',
        'B' to 'P',
        'C' to 'S',
    )
    val mappedLetterToOutcome = mapOf(
        'X' to 'L',
        'Y' to 'D',
        'Z' to 'W',
    )

    val necessaryOutcome = mappedLetterToOutcome[outcome]!!

    val mappedOP = mapLetterToShape[opponentShape]!!
    val choseShape = getShapeToMeetNecessaryOutcome(mappedOP, necessaryOutcome)

    // (0 if you lost, 3 if the round was a draw, and 6 if you won).
    val score = if (mappedOP == choseShape) {
        3
    } else {
        val opShape = shapes[mappedOP]
        val plShape = shapes[choseShape]

        if (opShape == 1 && plShape == 3) {
            0
        } else if (opShape == 3 && plShape == 1) {
            6
        } else if (opShape!! > plShape!!) {
            0
        } else {
            6
        }
    }

    return score + shapes[choseShape]!!
}

fun getShapeToMeetNecessaryOutcome(opponentAnswer: Char, necessaryOutcome: Char): Char {
    var shape: Char = opponentAnswer

    if (necessaryOutcome != 'D') {
        if (necessaryOutcome == 'L') {
            when (opponentAnswer) {
                'R' -> shape = 'S'
                'P' -> shape = 'R'
                'S' ->  shape = 'P'
            }
        } else if (necessaryOutcome == 'W') {
            when (opponentAnswer) {
                'R' -> shape = 'P'
                'P' -> shape = 'S'
                'S' -> shape = 'R'
            }
        }
    }

    return shape
}