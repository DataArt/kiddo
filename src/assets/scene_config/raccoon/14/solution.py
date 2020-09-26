import raccoon

raccoon.go_left()
raccoon.go_up()

object_left = raccoon.inspect(-1, 1)
while (object_left != 2):
    object_left = raccoon.inspect(-1, 1)

raccoon.wait(2)
raccoon.go_left()
raccoon.go_up()
raccoon.go_left(2)
raccoon.go_down()

object_down = raccoon.inspect(0, 1)
while (object_down != 2):
    object_down = raccoon.inspect(0, 1)

raccoon.wait()
raccoon.go_down()
raccoon.go_right()
raccoon.go_left()
raccoon.go_up(4)
raccoon.go_right()
raccoon.go_left()
raccoon.go_up(2)
raccoon.go_right()

object_right = raccoon.inspect([1, 0])
while (object_right != 2):
    object_right = raccoon.inspect([1, 0])

raccoon.wait()
raccoon.go_right(2)

object_right = raccoon.inspect(1, 0)
while (object_right != 2):
    object_right = raccoon.inspect(1, 0)

raccoon.wait()
raccoon.go_right()
raccoon.go_down()
raccoon.go_right(2)