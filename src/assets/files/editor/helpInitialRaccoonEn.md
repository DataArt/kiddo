<p style="color: #000; font-weight: bold;">1. Game field setting</p>

```javascript
this.setGameField([ [...1st tiles row], [...2nd tiles row], ...]);
```

<p style="color: #000;">As a method parameter, a two-dimensional array of elements is passed. Each of the elements takes one of the following values:</p>
<p style="color: #000;">'OF' — off road (empty cell)</p>
<p style="color: #000;">'BU' — bush</p>
<p style="color: #000;">'RO' — road</p>
<p style="color: #000;">'GR' — grass</p>
<p style="color: #000;">'FI' — final</p>
<p style="color: #000;">The game field size is automatically determined and based on the passed array.</p>
<p style="color: #000;">For example:</p>

```javascript
this.setGameField([
    ['OF', 'BU', 'RO'],
    ['RO', 'GR', 'FI'],
    ['RO', 'GR', 'OF']
]);
```

<p style="color: #000; font-weight: bold;">2. Add a custom tile</p>

```javascript
this.addCustomTile('tileName', 'tileImagePath');
```

<p style="color: #000;">where tileName is the name of the tile passed to 'this.setGameField' method, which sets the game field, and tileImagePath is the path to the tile's image.</p>

All custom tiles are obstacles on the game field.
<p style="color: #000;">For example:</p>

```javascript
this.addCustomTile('TR', 'https://i.imgur.com/ELvTBrD.png');

this.setGameField([
    ['TR', 'RO', 'TR'],
    ['TR', 'RO', 'TR'],
    ['TR', 'RO', 'TR']
]);
```
	
<p style="color: #000; font-weight: bold;">3. Setting player's initial position</p>
 
```javascript
this.setPlayerPosition(X, Y);
```
    
<p style="color: #000;">where X, Y are coordinates of player's initial position in the game field.</p>
<p style="color: #000;">X, Y coordinates values can be only non-negative integer. The plot origin is coincident with the upper left-hand cell with coordinates (0,0). The admissible maximum coordinates value depends on the game field size.
The player can be located only on the road within the game field. The player must not be located in the cell containing any other scene elements (cookie, final, monster, key, gates, turrets, mine, etc.).
</p>
<p style="color: #000;">For example:</p>
 
```javascript
this.setPlayerPosition(0, 2);
```
	
<p style="color: #000; font-weight: bold;">4. Adding cookies onto the game field</p>

```javascript
this.addCookies([X1, Y1], [X2, Y2], ...);
```
<p style="color: #000;">where [X1, Y1], [X2, Y2] are coordinates of each cookie.</p>
<p style="color: #000;">X, Y coordinates values can be only non-negative integer. The plot origin is coincident with the upper left-hand cell with coordinates (0,0). The admissible maximum number of cookies added is not restricted.
The cookie can be added only onto the road within the game field. The cookie can't be added into the cell containing any other scene elements (player, final, monster, key, gate, turrets, mine, etc.).
</p>
<p style="color: #000;">For example:</p>

```javascript
this.addCookies([0, 4], [2, 5], [1, 6]);
```
	
<p style="color: #000; font-weight: bold;">5. Adding turrets onto the game field</p>

```javascript
this.addTurrets([X1, Y1], [X2, Y2], ...);
```

<p style="color: #000;">where [X1, Y1], [X2, Y2] are each turret coordinates.</p>
<p style="color: #000;">X, Y coordinates values can be only non-negative integer. The plot origin is coincident with the upper left-hand cell with coordinates (0,0). The admissible maximum number of turrets added is not restricted.
The turret can be added only onto the road within the game field. The turret can't be added into the cell containing any other scene elements (player, cookie, final, monster, key, gate, mine, etc.).
</p>
<p style="color: #000;">For example:</p>

```javascript
this.addTurrets([2, 1]);
```
    
<p style="color: #000; font-weight: bold;">6. Adding mines on the game field</p>

```javascript
this.addMines([X1, Y1], [X2, Y2], ...);
```

<p style="color: #000;">where [X1, Y1], [X2, Y2] are each mine coordinates.</p>
<p style="color: #000;">X, Y coordinates values can be only non-negative integer. The plot origin is coincident with the upper left-hand cell with coordinates (0,0). The admissible maximum number of mines added is not restricted.
The mine can be added only onto the road within the game field. The mine can't be added into the cell containing any other scene elements (player, cookie, final, monster, key, gate, turret, etc.).</p>
<p style="color: #000;">For example:</p>

```javascript
this.addMines([3, 4], [2, 6]);
```

<p style="color: #000; font-weight: bold;">7.	Adding a key of a specific colour onto the game field </p>

```javascript
this.addKey([X, Y], 'color');
```

<p style="color: #000;">where [X, Y] are the key coordinates and 'color' refers to the key colour.</p>
<p style="color: #000;">X, Y coordinates values can be only non-negative integer. The plot origin is coincident with the upper left-hand cell with coordinates (0,0). 
The key can be added only onto the road within the game field. The key can't be added into the cell containing any other scene elements (player, cookie, final, monster, gates, etc.).
Calling method this.addKey([X, Y], 'color') again is required to add each extra key. The admissible maximum number of keys added is not restricted.
Each key of a specific colour must comply with at least one gate of the same colour. One key can open several gates of the matching colour. The list of keys colours by default is yellow, red and can be extended.</p>
<p style="color: #000;">For example:</p>

```javascript
this.addKey([1, 5], 'yellow');
```

<p style="color: #000;">The number of the scene elements to collect (cookie, mine, turret, key) must not exceed the game field length (the column number).</p>

<p style="color: #000; font-weight: bold;">8. Adding gates of a specific colour onto the game field</p>

```javascript
this.addGate([X, Y], 'color');
```

<p style="color: #000;">where [X, Y] are each gate coordinates and 'color' refers to the gate colour.
X, Y coordinates values can be only non-negative integer. The plot origin is coincident with the upper left-hand cell with coordinates (0,0). 
The gate can be located only on the road within the game field. The gate can't be located in the cell containing any other scene elements (player, cookie, final, monster, key, etc.). 
Calling method this.addGate([X, Y], 'color') again is required to add each extra gate. The admissible maximum number of gates added is not restricted. The gates number must be at least equal to the keys number on the game field.
The list of gates colours by default is yellow, red and can be extended.
</p>
<p style="color: #000;">For example:</p>

```javascript
this.addGate([2, 3], 'red');
```

<p style="color: #000; font-weight: bold;">9.	Adding a monster with the fixed initial position onto the game field</p>

```javascript
this.addMonster([X, Y], 'direction');
```

<p style="color: #000;">where [X, Y] are the  monster's fixed initial position coordinates and 'direction' refers to the monster's initial direction movement.</p>
<p style="color: #000;">X, Y coordinates values can be only non-negative integer. The plot origin is coincident with the upper left-hand cell with coordinates (0,0). 
The monster can move in one of the following initial directions (direction): right, left, up, and down. Upon reaching the road end, the monster's movement direction is reversed.
The monster can be located only on the road within the game field. The monster can't be located in the cell containing any other scene elements (player, cookie, final, key, turret, mine, etc.). 
Calling method this.addMonster([X, Y], 'direction') again is required to add each extra monster. The admissible maximum number of monsters added is not restricted.
</p>
<p style="color: #000;">For example:</p>

```javascript
this.addMonster([1, 1], 'right'); 
```

<p style="color: #000; font-weight: bold;">10. Adding a monster with a number of the possible initial positions onto the game field</p>

```javascript
this.addMonster([[X1, Y1], [X2, Y2], ...], 'direction');
```

<p style="color: #000;">where [X1, Y1], [X2, Y2] are the  monster's possible initial positions coordinates and 'direction' refers to the monster's initial direction movement.</p>
<p style="color: #000;">X, Y coordinates values can be only non-negative integer. The plot origin is coincident with the upper left-hand cell with coordinates (0,0). The monster's initial position can be any element of the array [[X1, Y1], [X2, Y2], ...]. A certain position is chosen randomly on every launch. 
The monster can move in one of the following initial directions (direction): right, left, up, and down. Upon reaching the road end, the monster's movement direction is reversed.
The monster can be located only on the road within the game field. The monster can't be located in the cell containing any other scene elements (player, cookie, final, key, turret, mine, etc.). 
Calling method this.addMonster([[X1, Y1], [X2, Y2], ...], 'direction') again is required to add each extra monster. The admissible maximum number of monsters added is not restricted.
</p>
<p style="color: #000;">For example:</p>

```javascript
this.addMonster([ [1, 1], [2, 1], [3, 1] ], 'left');
```

<p style="color: #000; font-weight: bold;">11.	 Adding a monster in the Chase the player mode</p>

```javascript
this.addMonster([X, Y], 'direction', true);
```

<p style="color: #000;">where [X, Y] are the  monster's fixed initial position coordinates and 'direction' refers to the monster's initial direction movement while “true” indicates that the monster chases the player.</p>
<p style="color: #000;">X, Y coordinates values can be only non-negative integer. The plot origin is coincident with the upper left-hand cell with coordinates (0,0). 
The monster can move in one of the following initial directions (direction): right, left, up, and down. The monster always moves towards the player.
The monster can be located only on the road within the game field. The monster can't be located in the cell containing any other scene elements (player, cookie, final, key, turret, mine, etc.).
Calling method this.addMonster([X, Y], 'direction', true)  again is required to add each extra monster. The admissible maximum number of monsters added is not restricted.
</p>
<p style="color: #000;">For example:</p>

```javascript
this.addMonster([1, 1], 'right', true); 
```

<p style="color: #000; font-weight: bold;">12.	Adding the checking logic code</p>

```javascript
this.addCheckingLogic('code');
```

<p style="color: #000;">where code is a JS function that returns null/undefined or an error text string (for example, “Finish Not Reached”).</p>
<p style="color: #000;">For example:</p>

```javascript
this.addCheckingLogic(`
    return this.player.position.x === 8 && this.player.position.y === 0
        ? null
        : 'FINISH_NOT_REACHED'
`);
```

<p style="color: #000; font-weight: bold;">The following example shows a simple scene's configuration:</p>

```javascript
this.setGameField([ ['RO', 'RO', 'RO'], ['RO', 'GR', 'RO'], ['RO', 'RO', 'FI'] ]);
this.setPlayerPosition(0, 0);
this.addMonster([1, 2], 'left');
this.addCheckingLogic(`
    return this.player.position.x === 2 &&this.player.position.y === 2
        ? null
        : 'FINISH_NOT_REACHED'
`);
```

<p style="color: #000;">If game objects (cookies, cannons, mines, cannons, keys, doors and monsters) do not appear on the field, check the correctness and order of the arguments that you pass to the add methods.</p>