import raccoon

raccoon.go_right(2)
raccoon.go_up()

object_right = raccoon.inspect(1, 0)
while (object_right != 2):
    object_right = raccoon.inspect(1, 0)

raccoon.wait(2)
raccoon.go_right(3)

object_down_right = raccoon.inspect(1, 1)
while (object_down_right != 2):
    object_down_right = raccoon.inspect(1, 1)

raccoon.wait(2)
raccoon.go_right()
raccoon.go_up(2)

raccoon.go_right()
raccoon.go_up(2)

raccoon.wait(2)

raccoon.go_left()
raccoon.go_up()

raccoon.go_left(2)
raccoon.go_down(2)

object_left = raccoon.inspect(-1, 0)
while (object_left != 2):
    object_left = raccoon.inspect(-1, 0)

raccoon.wait()
raccoon.go_left(3)
raccoon.go_up(2)