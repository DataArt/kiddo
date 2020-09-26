<span style="color: #000;">Dieses Skript soll in der Programmiersprache Python geschrieben werden. Wenn Sie nicht damit vertraut sind oder die Grundlagen auffrischen müssen, verwenden Sie <a href="https://docs.python.org/3/tutorial/index.html" target="_blank" rel="nofollow">das Link</a>.</span>

<span style="color: #000;">Je nach Aufgabe kann das Level auf unterschiedliche Weise generiert werden. Wenn Sie auf "Regenerate Level" klicken, erhalten Sie verschiedene Optionen für die Anfangsbedingungen. Manchmal ist der Pegel konstant mit denselben Variablenwerten.</span>

<span style="color: #000;">Um die Ebene zu bestehen, müssen Sie das "Console" -Modul importieren, das für die Arbeit mit Konsolenvariablen verwendet wird:</span>
```python
import console
```

<span style="color: #000;">Sie können mit Konsolenvariablen mit den folgenden Methoden arbeiten:</span>
* ```python
    console.get_value("name")
    ```
    <p style="color: #000;">Holen Sie sich den Variablenwert</p>

* ```python
    console.set_value("name", value)
    ```
    <p style="color: #000;">Geben Sie den Variablenwert an</p>

* ```python
    print()
    ```
    <p style="color: #000;">Drucken Sie die angegebene Nachricht oder den angegebenen Variablenwert auf dem Konsolenbildschirm</p>

#### <span style="color: #000;">Beispiele</span> 
##### <span style="color: #000;">Aufgabe</span>
<p style="color: #000;">Addieren Sie den Wert der Variablen A und B zur Variablen C. Und zeigen / drucken Sie diesen Wert auf der Konsole.</p>

##### <span style="color: #000;">Lösung</span>
```python
import console
sum = console.get_value('a') + console.get_value('b')
console.set_value("c", sum)
print console.get_value("c")
```