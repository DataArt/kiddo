import player
 
player.put_on_mask()
player.go_down()
player.go_left()
player.go_down()
 
viruses_down = player.look(0, 1)
while viruses_down != 2:
    viruses_down = player.look(0, 1)
player.disinfect(5)
player.go_down()
 
player.go_left()
 
viruses_down = player.look(-1, 3)
while viruses_down != 2:
    viruses_down = player.look(-1, 3)
 
player.go_left(3)
player.go_up(2)
 
viruses_down = player.look(-1, 3)
while viruses_down != 2:
    viruses_down = player.look(-1, 3)
 
player.go_left()
player.go_up()
player.wash_hands()