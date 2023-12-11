# Advent Of Code '2023

My [Advent of Code](https://adventofcode.com) adventures.<br />
Estonian private leaderboard (by petskratt) is here: https://adventofcode.com/2023/leaderboard/private/view/652748.

## Diary

* `Day 01` **Trebuchet?!**: The part #2 had quite a clever trap in it, making initial _"common sense"_ 😁 left-to-right
  approach fail.
* `Day 02` **Cube Conundrum**: Very simple once you understand the task. I am a slow reader, though.
* `Day 03` **Gear ratios**: I absolutely HATE _any tasks_ that involve keeping track of _**position indices**_! 🤮
  The parts adjacency checking is too complex, because I expected the parts can be of any length - this did not happen.
* `Day 04` **Scratchcards**: #1 was super simple; #2 was hard to visualize - a straightforward rules-based simulation 🤖
  did the trick!
* `Day 05` **If You Give A Seed A Fertilizer**:
  1. Computing is easy, but...
  2. Idea of super-positioning of individual transformation steps was easy, but implementation required mental clarity I
     am usually short of! 🤯
* `Day 06` **Wait For It**: Just solving a square equation w discrete values. I wasted an insane amount of time
  because of using 'analogue' approach instead of 'digital' one (starting at line 19)... w/o taking some time to think
  it over. 🫠
* `Day 07` **Camel Cards**: Puzzle #2 really required a keen eye 🤤 when reading the description.
* `Day 08` **Haunted Wasteland**: This was just ingenious - it is _**so important**_ to follow task description details!
* `Day 09` **Mirage Maintenance**: Easy. 🌴🌴🌴
* `Day 11` **Cosmic Expansion**: Unexpectedly simple. But as usual, I lost quite some time because of appallingly stupid index error. 🫠
  At stage #1 I implemented the gaps quite inefficiently, thinking that this weirdness might pay off
  at stage #2 (maybe new galaxies should be generated or something)... it didn't!

## Track record

| day | lines | mins1 | mins2 | M1_µs | M2_µs | D1_µs | D2_µs |
|----:|------:|------:|------:|------:|------:|------:|------:|
|  01 |    66 |    15 |    49 |  1035 |  2583 |    11 |    33 |
|  02 |    71 |    32 |    13 |   192 |   509 |    12 |    12 |
|  03 |    85 |    62 |    36 |  8044 |    16 |    37 |    17 |
|  04 |    53 |    18 |    66 |   240 |   608 |    12 |    92 |
|  05 |   109 |    70 |   >4h |  4862 |  3413 |   130 |   111 |
|  06 |    50 |    62 |     6 |     6 |     5 |    11 |     2 |
|  07 |    87 |    48 |   265 |  1493 |  1653 |    10 |    12 |
|  09 |    78 |    45 |    33 |  1963 |   860 |    16 |    15 |
|  11 |   110 |    50 |    20 | 11781 |  8649 |   160 |    32 |

Up there, prefix _'M'_ stands for _main_ and _'D'_ for _demo data_.<br>
When some results from step #1 are re-used, then step #2 can be quicker.

![](quote.png)

## The older ones

[2022](https://github.com/valango/adventOfCode_2022)
[2021](https://github.com/valango/adventOfCode_2021)
[2020](https://github.com/valango/adventOfCode)
[2015](https://github.com/valango/AdventOfCode_2015)
