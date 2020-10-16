<span style="color: #000;">Dieses Skript muss in der Programmiersprache Python geschrieben werden. Wenn Sie damit nicht vertraut sind oder die Grundlagen auffrischen müssen, verwenden Sie <a href="https://docs.python.org/3/tutorial/index.html" target="_blank" rel="nofollow">diesen Link</a>.</span>

<span style="color: #000;">Je nach Aufgabe kann die Ebene auf verschiedene Arten generiert werden. Wenn Sie auf "Regeneriere das Level" klicken, erhalten Sie verschiedene Optionen für die Anfangsbedingungen. Manchmal ist der Pegel mit denselben Anfangsbedingungen konstant.</span>

<span style="color: #000;">Um das Level zu bestehen, müssen Sie das Modul "Player" importieren, mit dem der Waschbär gesteuert wird:</span>
```python
import player
```

<span style="color: #000;">Der Spieler wird wie folgt gesteuert:</span>
* ```python
    player.go_left(n)
    ```
    <p style="color: #000;">Verschieben Sie "n" Zellen nach links. Der Standardwert ist 1.</p>

* ```python
    player.go_right(n)
    ```
    <p style="color: #000;">Verschieben Sie "n" Zellen nach rechts. Der Standardwert ist 1.</p>

* ```python
    player.go_up(n)
    ```
    <p style="color: #000;">Verschiebe "n" Zellen nach oben. Der Standardwert ist 1.</p>

* ```python
    player.go_down(n)
    ```
    <p style="color: #000;">Verschieben Sie "n" Zellen nach unten. Der Standardwert ist 1.</p>

* ```python
    player.wait(n)
    ```
    <p style="color: #000;">Warten Sie, bis "n" gedreht wird. Der Standardwert ist 1. Der maximal zulässige Wert beträgt 100.</p>
    
* ```python
    player.look
    ```
    <p style="color: #000;">Es gibt zwei Möglichkeiten, eine Methode aufzurufen:</p>

    ```python
    player.look(X, Y)
    ```
    <p style="color: #000;">Gibt eine einzelne Zahl zurück, je nachdem, was sich in der angegebenen Richtung befindet.</p>

    ```python
    player.look([X1, Y1], [X2, Y2], [X3, Y3], ...) 
    ```
    <p style="color: #000;">Der gibt abhängig von der angegebenen Richtung ein Array von Zahlen zurück, das so viele Zahlen enthält, wie Zellen überprüft wurden.</p>
    <p style="color: #000;">
    Rückgabewerte:<br>
    0 - unpassierbares Gelände<br>
    1 - Straße<br>
    2 - Virus<br>
    3 - Person<br>
    4 - Maske oder Desinfektionsmittel<br>
    </p>
    <p style="color: #000;">Methodenparameter: X ist die Zahl, die die horizontale Abweichung relativ zur Position des Spielers angibt, Y ist eine vertikale Abweichung. <strong style="color: #000;">Parameterwerte können nur Zahlen aus dem Bereich -3 bis 3 sein</strong>.
Die Koordinaten werden <strong style = "color: #000;"> von links nach rechts (X) </strong> und <strong style = "color: #000;"> von oben nach unten (Y) </strong> gezählt. Beispielsweise befindet sich die Koordinate (1, -1) relativ zum Spieler oben rechts.</p>

* ```python
    player.put_on_mask()
    ```
    <p style="color: #000;">Maske setzen.</p>

* ```python
    player.wash_hands()
    ```
    <p style="color: #000;">Hände waschen.</p>
    
* ```python
    player.get_products()
    ```
    <p style="color: #000;">Lebensmittel einkaufen</p>

* ```python
    player.disinfect(direction)
    ```
    <p style="color: #000;">Desinfizieren Sie die Zelle in der jeweiligen Richtung, wobei "Richtung" eine Zahl von 0 bis 7 ist, die die Zelle um den Player angibt. 0 ist die Zelle über dem Zeichen, 1 ist die obere rechte Zelle relativ zum Zeichen usw. im Uhrzeigersinn.</p>

<p style="color: #000;">Jede der oben genannten Methoden dauert 1 Spielrunde.</p>

#### <span style="color: #000;">Beispiel 1</span>
<span style = "color: #000;">Der folgende Code verschiebt den Spieler um zwei Zellen nach rechts und eine Zelle nach oben:</span>
```python
import player

player.go_right(2)
player.go_up()
```

#### <span style="color: #000;">Beispiel 2</span>
<span style="color: #000;">Der folgende Code prüft, ob in der Zelle links vom Charakter eine Maske oder ein Desinfektionsmittel vorhanden ist: player.look (-1, 0) == 4. Wenn diese Bedingung erfüllt ist, geht der Charakter eine Zelle nach links:</span>
```python
import player

if player.look(-1, 0) == 4:
    player.go_left()
```

#### <span style="color: #000;">Beispiel 3</span>
<span style = "color: #000;">Der folgende Code sucht in den Zellen unten rechts ([1, 1]) und oben rechts ([1, -1]) des Zeichens nach Viren. Wenn diese Bedingungen erfüllt sind, geht der Charakter ein Feld nach rechts, andernfalls wartet er eine Runde:</span>
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

#### <span style="color: #000;">Beispiel 4</span>
<span style = "color: #000;">Der folgende Code sucht nach dem sich nach oben bewegenden Virus unten links im Charakter (player.look (-1, 1) == 2) und zerstört ihn im zweiten Zug (da der erste Zug mit dem Aufrufen der player.look-Methode verbracht wurde) - player.disinfect(7):</span>
```python
import player

if player.look(-1, 1) == 2:
    player.disinfect(7)
```
