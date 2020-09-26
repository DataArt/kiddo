<span style="color: #000;">This script is to be written in Python programming language. If you are not familiar with it or you or need to brush up on the basics, use <a href="https://docs.python.org/3/tutorial/index.html" target="_blank" rel="nofollow">this link</a>.</span>

<span style="color: #000;">Depending on the task, the level can be generated in different ways. Clicking on  "Regenerate the level" button, you get different options for the initial terms. Sometimes the level will be constant with the same initial terms.</span>

<span style="color: #000;">To pass the level, you need to import the "player" module that is used to control the player on the game field:</span>
```python
import player
```

<span style="color: #000;">The player is controlled as following:</span>
* ```python
    player.go_left(n)
    ```
    <p style="color: #000;">Move "n" cells to the left. The default value is 1.</p>

* ```python
    player.go_right(n)
    ```
    <p style="color: #000;">Move "n" cells to the right. The default value is 1.</p>

* ```python
    player.go_up(n)
    ```
    <p style="color: #000;">Move "n" cells upwards. The default value is 1.</p>

* ```python
    player.go_down(n)
    ```
    <p style="color: #000;">Move "n" cells down. The default value is 1.</p>

* ```python
    player.wait(n)
    ```
    <p style="color: #000;">Wait for "n" turns. The default value is 1. The maximum allowed value is 100.</p>
    
* ```python
    player.look
    ```
    <p style="color: #000;">There are two ways to invoke a method:</p>

    ```python
    player.look(X, Y)
    ```
    <p style="color: #000;">This returns the only number depending on what follows in the specified direction.</p>

    ```python
    player.look([X1, Y1], [X2, Y2], [X3, Y3], ...) 
    ```
    <p style="color: #000;">This returns the array of numbers containing as many of them as there are cells to check and depending on what follows in the specified direction.</p>
    <p style="color: #000;">
    Return values:<br>
    0 - impassable area<br>
    1 - road<br>
    2 - virus<br>
    3 - person<br>
    4 - mask or sanitizer<br>
    </p>
    <p style="color: #000;">Method parameters: X is the number indicating the horizontal deviation relative to the position of the player, Y is a vertical deviation. <strong style="color: #000;">Parameter values can only be numbers from the range -3 to 3</strong>.
Coordinates are counted <strong style="color: #000;">from left to right (X)</strong> and <strong style="color: #000;">from the top down (Y)</strong>. For example, the coordinate (1, -1) relative to the player is located in the upper right.</p>

* ```python
    player.put_on_mask()
    ```
    <p style="color: #000;">Put on a mask.</p>

* ```python
    player.wash_hands()
    ```
    <p style="color: #000;">Wash hands.</p>
    
* ```python
    player.get_products()
    ```
    <p style="color: #000;">Buy groceries.</p>

* ```python
    player.disinfect(direction)
    ```
    <p style="color: #000;">Disinfect the cell in the particular direction, where "direction" is a number from 0 to 7 indicating the cell around the player. 0 is the cell above the character, 1 is the top right cell relative to the character, and so on clockwise.</p>

<p style="color: #000;">Each of the above mentioned methods takes 1 game turn.</p>

#### <span style="color: #000;">Example 1</span>
<span style="color: #000;">The following code will move the player two cells to the right and one cell up:</span>
```python
import player

player.go_right(2)
player.go_up()
```

#### <span style="color: #000;">Example 2</span>
<span style="color: #000;">This code verifies if there is a mask or a sanitizer in the cell on the character’s right: player.look(-1, 0) == 4. When this condition is met, the character moves one cell left:</span>
```python
import player

if player.look(-1, 0) == 4:
    player.go_left()
```

#### <span style="color: #000;">Example 3</span>
<span style="color: #000;">This code verifies if there are no viruses in the cells down ([1 , 1])  and up ([1, -1])  on the character’s right. When this condition is met, the character moves one cell right or waits otherwise:</span>
```python
import player

objects_around = player.look([1, 1], [1, -1])
if (objects_around[0] != 2 
    and objects_around[1] != 2):
        player.go_right()
else:
    player.wait()
    ...
```

#### <span style="color: #000;">Example 4</span>
<span style="color: #000;">This code verifies if there is a virus moving upwards down on the character’s left (player.look(-1, 1) == 2) and destroys it within the second move (since the first one is to invoke a method player.look) - player.disinfect(7):</span>
```python
import player

if player.look(-1, 1) == 2:
    player.disinfect(7)
```
