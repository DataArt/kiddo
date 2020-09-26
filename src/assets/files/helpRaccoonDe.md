<span style="color: #000;">Dieses Skript muss in der Programmiersprache Python geschrieben werden. Wenn Sie damit nicht vertraut sind oder die Grundlagen auffrischen müssen, verwenden Sie <a href="https://docs.python.org/3/tutorial/index.html" target="_blank" rel="nofollow">diesen Link</a>.</span>

<span style="color: #000;">Je nach Aufgabe kann die Ebene auf verschiedene Arten generiert werden. Wenn Sie auf "Regeneriere das Level" klicken, erhalten Sie verschiedene Optionen für die Anfangsbedingungen. Manchmal ist der Pegel mit denselben Anfangsbedingungen konstant.</span>

<span style="color: #000;">Um das Level zu bestehen, müssen Sie das Modul "Raccoon" importieren, mit dem der Waschbär gesteuert wird:</span>
```python
import raccoon
```

<span style="color: #000;">Der Waschbär wird wie folgt gesteuert:</span>
* ```python
    raccoon.go_left(n)
    ```
    <p style="color: #000;">Verschieben Sie "n" Zellen nach links. Der Standardwert ist 1.</p>

* ```python
    raccoon.go_right(n)
    ```
    <p style="color: #000;">Verschieben Sie "n" Zellen nach rechts. Der Standardwert ist 1.</p>

* ```python
    raccoon.go_up(n)
    ```
    <p style="color: #000;">Verschiebe "n" Zellen nach oben. Der Standardwert ist 1.</p>

* ```python
    raccoon.go_down(n)
    ```
    <p style="color: #000;">Verschieben Sie "n" Zellen nach unten. Der Standardwert ist 1.</p>

* ```python
    raccoon.wait(n)
    ```
    <p style="color: #000;">Warten Sie, bis "n" gedreht wird. Der Standardwert ist 1. Der maximal zulässige Wert beträgt 100.</p>
    
* ```python
    raccoon.inspect
    ```
    <p style="color: #000;">Es gibt zwei Möglichkeiten, eine Methode aufzurufen:</p>

    ```python
    raccoon.inspect(X, Y)
    ```
    <p style="color: #000;">Gibt eine einzelne Zahl zurück, je nachdem, was sich in der angegebenen Richtung befindet.</p>

    ```python
    raccoon.inspect([X1, Y1], [X2, Y2], [X3, Y3], ...) 
    ```
    <p style="color: #000;">Der gibt abhängig von der angegebenen Richtung ein Array von Zahlen zurück, das so viele Zahlen enthält, wie Zellen überprüft wurden.</p>
    <p style="color: #000;">
    Rückgabewerte:<br>
    0 - unpassierbares Gelände<br>
    1 - Straße<br>
    2 - Monster<br>
    3 - Keks<br>
    4 - Ausgang aus dem Labyrinth<br>
    </p>
    <p style="color: #000;">Methodenparameter: X ist die Zahl, die die horizontale Abweichung relativ zur Position des Waschbären angibt, Y ist eine vertikale Abweichung. <strong style = "color: #000;">Parameterwerte können nur die Zahlen -1, 0 oder 1 sein</strong>.
Die Koordinaten werden <strong style = "color: #000;"> von links nach rechts (X) </strong> und <strong style = "color: #000;"> von oben nach unten (Y) </strong> gezählt. Beispielsweise befindet sich die Koordinate (1, -1) relativ zum Waschbären oben rechts.</p>

* ```python
    raccoon.set_mine()
    ```
    <p style="color: #000;">Platziert eine Mine in der Zelle, in der sich der Waschbär gerade befindet. Die Mine wird aktiviert, nachdem sie von einem Monster getroffen wurde.</p>

* ```python
    raccoon.place_turret()
    ```
    <p style="color: #000;">Aktiviert den Turm in der Zelle, in der sich der Waschbär gerade befindet. Der Turm schießt auf Monster, die eine Zelle von ihm entfernt sind.</p>

<p style="color: #000;">Jede der oben genannten Methoden dauert 1 Spielrunde.</p>

<p style="color: #000;">Je nach Aufgabe befinden sich möglicherweise Tore und Schlüssel in verschiedenen Farben auf dem Spielfeld. Ein Versuch, ohne einen passenden Farbschlüssel durch das Tor zu gelangen, schlägt fehl. Ein Schlüssel kann mehrere Tore derselben Farbe öffnen.</p>

#### <span style="color: #000;">Beispiel 1</span>
<span style = "color: #000;">Mit dem folgenden Code wird der Waschbär zwei Zellen nach rechts und eine Zelle nach oben verschoben:</span>
```python
import raccoon

raccoon.go_right(2)
raccoon.go_up()
```

#### <span style="color: #000;">Beispiel 2</span>
<span style="color: #000;">Der folgende Code prüft, ob in der Zelle links vom Waschbären Cookies vorhanden sind: raccoon.inspect (-1, 0) == 3. Wenn diese Bedingung erfüllt ist, geht der Waschbär eine Zelle nach links:</span>
```python
import raccoon

if raccoon.inspect(-1, 0) == 3:
    raccoon.go_left()
```

#### <span style="color: #000;">Beispiel 3</span>
<span style="color: #000;">TDer folgende Code überprüft, ob in den Zellen unten rechts ([1, 1]) und oben rechts ([1, -1]) des Waschbären Monster vorhanden sind: raccoon.inspect ([1, 1], [1, -1]). Wenn diese Bedingungen erfüllt sind, bewegt der Waschbär einen Käfig nach rechts, andernfalls wartet er eine Runde:</span>
```python
import raccoon

objects_around = raccoon.inspect([1, 1], [1, -1])
if (objects_around[0] != 2
    and objects_around[1] != 2):
        raccoon.go_right()
else:
    raccoon.wait()
    ...
```