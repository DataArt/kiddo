import player
 
player.put_on_mask()
player.go_right(3)
if player.look(-1, 2) == 3:
    player.go_right()
    player.wait(2)
    player.go_left()
if player.look(-1, 2) == 3:
    player.wait(4)
player.go_down(2)
player.go_right()
player.go_down(4)
player.wash_hands()