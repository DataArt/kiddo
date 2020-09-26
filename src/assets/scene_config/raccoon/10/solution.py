import raccoon

raccoon.go_left()
raccoon.go_up(2)
raccoon.go_left()

object_down_left = raccoon.inspect(-1, 1)

while (object_down_left != 2):
    object_down_left = raccoon.inspect(-1, 1)

raccoon.go_left(2)
raccoon.go_up()

object_right = raccoon.inspect(1, 0)
while (object_right != 2):
    object_right = raccoon.inspect(1, 0)

object_right = raccoon.inspect(1, 0)
while (object_right != 2):
    object_right = raccoon.inspect(1, 0)

raccoon.wait()
raccoon.go_right()
raccoon.go_up(3)
raccoon.go_right()

object_left = raccoon.inspect(-1, 0)
while (object_left != 2):
    object_left = raccoon.inspect(-1, 0)

raccoon.wait()
raccoon.go_left()
raccoon.go_down()

objects_down = raccoon.inspect([-1, 1], [0, 1], [1, 1])
while (2 in objects_down):
    objects_down = raccoon.inspect([-1, 1], [0, 1], [1, 1])

raccoon.go_down(2)
raccoon.go_left()
raccoon.go_down(2)
raccoon.go_left()