
<p style="color: #000; font-weight: bold;">1. Game Field setting</p>

```javascript
this.setGameField([ [...1st row tiles], [...2nd row tiles], ...])
```

<p style="color: #000;">As a method parameter, a two-dimensional array of elements, where the rows number is equal to the column one with the admissible maximum of 20, is passed. Each of the elements takes one of the following values:</p>
<p style="color: #000;">'OF' – off-road</p>
<p style="color: #000;">'FE' - fence </p>
<p style="color: #000;">'CO' - conus</p>
<p style="color: #000;">'HO' - home</p>
<p style="color: #000;">'SH' - shop</p>
<p style="color: #000;">L1', 'L2', 'L3', 'L4' – mall (top left-hand area, top right-hand, lower left-hand and lower right hand areas respectively)</p>
<p style="color: #000;">The game field size is automatically determined and based on the passed array.</p>
<p style="color: #000;">For example:</p>

```javascript
    this.setGameField([
		['OF', 'SH', 'FE', 'CO'],
		['RO', 'L1', 'L2', 'FE'],
		['RO', 'L3', 'L4', 'FE'],
		['HO', 'RO', 'RO', 'OF'])
])
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
	
<p style="color: #000; font-weight: bold;">3. Setting player’s initial position</p>
 
```javascript
    this.setPlayerPosition(X, Y)
```
    
<p style="color: #000;">where X, Y are coordinates of player’s initial position in the game field.</p>
<p style="color: #000;">X, Y coordinates values can be only non-negative integer. The plot origin is coincident with the upper left-hand cell with coordinates (0,0). The admissible maximum coordinates value depends on the game field size.
The player can be located only on the road within the game field. The player must not be located in the cell containing any other scene elements (mask, sanitizer, virus or people) 
</p>
<p style="color: #000;">For example:</p>
 
```javascript
    this.setPlayerPosition(0, 2);
```
	
<p style="color: #000; font-weight: bold;">4. Adding masks to the scene</p>

```javascript
    this.addMasks([X1, Y1], [X2, Y2], ...)
```
<p style="color: #000;">where ([X1, Y1], [X2, Y2], ...) are each mask coordinates.</p>
<p style="color: #000;">X, Y coordinates values can be only non-negative integer. The plot origin is coincident with the upper left-hand cell with coordinates (0,0). The admissible maximum number of masks added is not restricted.
The mask can be added only onto the road within the game field. The mask can’t be added into the cell containing any other scene elements (sanitizer, virus or people)
</p>
<p style="color: #000;">For example:</p>

```javascript
    this.addMasks([0, 4], [2, 5], [1, 6]);
```

<p style="color: #000; font-weight: bold;">5. (TODO: translate) Добавить обязательное правило ношения маски</p>

```javascript
    this.setWearingMaskAsRequired()
```
<p style="color: #000;">Если в конфиге задан этот метод, перед началом любых ходов игроку необходимо надеть маску, иначе игра прервется, и уровень будет пройден.</p>
	
<p style="color: #000; font-weight: bold;">6.	Adding sanitizers to the scene</p>

```javascript
    this.addSanitizers([X1, Y1], [X2, Y2], ...);
```

<p style="color: #000;">where ([X1, Y1], [X2, Y2], ...) are each sanitizer coordinates.</p>
<p style="color: #000;">X, Y coordinates values can be only non-negative integer. The plot origin is coincident with the upper left-hand cell with coordinates (0,0). The admissible maximum number of sanitizers added is not restricted.
The sanitizer can be added only onto the road within the game field. The sanitizer can’t be added into the cell containing any other scene elements (mask, virus or people)
</p>
<p style="color: #000;">For example:</p>

```javascript
    this.addSanitizers([0, 4], [2, 5]);
```
    
<p style="color: #000; font-weight: bold;">7. Adding a person with the fixed initial position onto the game field</p>

```javascript
this.addPerson([X, Y], 'direction');
```

<p style="color: #000;">where [X, Y] are the  person’s initial position coordinates and 'direction' refers to the person’s initial direction movement.</p>
<p style="color: #000;">X, Y coordinates values can be only non-negative integer. The plot origin is coincident with the upper left-hand cell with coordinates (0,0). 
The person can move in one of the following initial directions (direction): right, left, up and down. Upon reaching the road end, the person’s movement direction is reversed.
The person can be located only on the road within the game field. The person can’t be located in the cell containing any other scene elements (player, mask, virus or sanitizer) 
Calling method this.addPerson ([X, Y], 'direction') again is required to add each extra person. The admissible maximum number of people added is not restricted.
</p>
<p style="color: #000;">For example:</p>

```javascript
this.addPerson([1, 1], 'left');
```

<p style="color: #000; font-weight: bold;">8. Adding a person with a number of the possible initial positions onto the game field</p>

```javascript
this.addPerson([[X1, Y1], [X2, Y2], ...], 'direction');
```

<p style="color: #000;">where [X1, Y1], [X2, Y2] are the  person’s possible initial positions coordinates and 'direction' refers to the person’s initial direction movement.</p>
<p style="color: #000;">X, Y coordinates values can be only non-negative integer. The plot origin is coincident with the upper left-hand cell with coordinates (0,0). The person’s initial position can be any element of the array [[X1, Y1], [X2, Y2], ...]. A certain position is chosen randomly on every launch. 
The person can move in one of the following initial directions (direction): right, left, up and down. Upon reaching the road end, the person’s movement direction is reversed.
The person can be located only on the road within the game field. The person can’t be located in the cell containing any other scene elements (player, mask, virus or sanitizer) 
Calling method this.addPerson ([[X1, Y1], [X2, Y2], ...], 'direction') again is required to add each extra person. The admissible maximum number of people added is not restricted.
</p>
<p style="color: #000;">For example:</p>

```javascript
this.addPerson([ [1, 1], [2, 1], [3, 1] ], 'up');
```

<p style="color: #000; font-weight: bold;">9. Adding a virus with the fixed initial position onto the game field</p>

```javascript
this.addVirus([X, Y], 'direction');
```

<p style="color: #000;">where [X, Y] are the  virus’s fixed initial position coordinates and 'direction' refers to the virus’s initial direction movement.</p>
<p style="color: #000;">X, Y coordinates values can be only non-negative integer. The plot origin is coincident with the upper left-hand cell with coordinates (0,0). 
The virus can move in one of the following initial directions (direction): right, left, up and down. Upon reaching the road end, the virus’s movement direction is reversed.
The virus can be located only on the road within the game field. The virus can’t be located in the cell containing any other scene elements (player, mask, person or sanitizer) 
Calling method this.addVirus ([X, Y], 'direction') again is required to add each extra virus. The admissible maximum number of viruses added is not restricted.
</p>
<p style="color: #000;">For example:</p>

```javascript
this.addVirus([1, 1], 'left')
```

<p style="color: #000; font-weight: bold;">10.	Adding a virus with a number of the possible initial positions onto the game field</p>

```javascript
this.addVirus([[X1, Y1], [X2, Y2], ...], 'direction');
```

<p style="color: #000;">where [X1, Y1], [X2, Y2] are the  virus’s possible initial positions coordinates and 'direction' refers to the virus’s initial direction movement.</p>
<p style="color: #000;">X, Y coordinates values can be only non-negative integer. The plot origin is coincident with the upper left-hand cell with coordinates (0,0). The virus’s initial position can be any element of the array [[X1, Y1], [X2, Y2], ...]. A certain position is chosen randomly on every launch. 
The virus can move in one of the following initial directions (direction): right, left, up and down. Upon reaching the road end, the virus’s movement direction is reversed.
The virus can be located only on the road within the game field. The virus can’t be located in the cell containing any other scene elements (player, mask, person or sanitizer) 
Calling method this.addVirus([[X1, Y1], [X2, Y2], ...], 'direction') again is required to add each extra virus. The admissible maximum number of viruses added is not restricted.
</p>
<p style="color: #000;">For example:</p>

```javascript
this.addVirus([ [1, 1], [2, 1], [3, 1] ], 'up'); 
```

<p style="color: #000; font-weight: bold;">11. Adding a virus with the player chase function</p>

```javascript
this.addVirus([X, Y], 'direction', true); 
```

<p style="color: #000;">where [X, Y] are the  virus’s fixed initial position coordinates and 'direction' refers to the monster’s initial direction movement while “true” indicates that the virus chases the player.</p>
<p style="color: #000;">X, Y coordinates values can be only non-negative integer. The plot origin is coincident with the upper left-hand cell with coordinates (0,0). 
The virus can move in one of the following initial directions (direction): right, left, up and down. The virus always moves towards the player.
The virus can be located only on the road within the game field. The virus can’t be located in the cell containing any other scene elements (player, mask, person or sanitizer) 
Calling method this.addVirus([X, Y], 'direction', true) again is required to add each extra virus. The admissible maximum number of viruses added is not restricted.
</p>
<p style="color: #000;">Пример:</p>

```javascript
this.addVirus([1, 1], 'right', true);
```

<p style="color: #000; font-weight: bold;">12.	Adding the checking logic code</p>

```javascript
this.addCheckingLogic('code')
```

<p style="color: #000;">where code - JS-function that returns null / undefined or an error text string (for example, “Finish Not Reached”)</p>
<p style="color: #000;">For example:</p>

```javascript
this.addCheckingLogic('return this.player.position.x === 8 && this.player.position.y === 0 ? null : `FINISH_NOT_REACHED`'});
```

<p style="color: #000; font-weight: bold;">The following example shows a simple scene's configuration:</p>

```javascript
this.setGameField([ ['RO', 'RO', 'RO'], ['RO', 'FE', 'RO'], ['RO', 'RO', 'HO'] ]);
this.setPlayerPosition(0, 0);
this.addVirus([1, 2], 'left');
this.addCheckingLogic(`
    return this.player.position.x === 2 &&this.player.position.y === 2
        ? null
        : 'FINISH_NOT_REACHED'
`);
```

<p style="color: #000;">If game objects do not appear on the field, check the correctness and order of the arguments that you pass to the add methods.</p>