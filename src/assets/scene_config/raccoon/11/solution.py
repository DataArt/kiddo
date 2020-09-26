import raccoon

raccoon.go_up()
raccoon.go_right()

objects_atop = raccoon.inspect([-1, -1], [0, -1], [1, -1])

while (2 in objects_atop):
    objects_atop = raccoon.inspect([-1, -1], [0, -1], [1, -1])

raccoon.go_up(3)
raccoon.go_right(2)

object_up_right = raccoon.inspect(1, -1)
while (object_up_right != 2):
    object_up_right = raccoon.inspect(1, -1)

raccoon.wait(2)
raccoon.go_right(2)