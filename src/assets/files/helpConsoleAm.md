<span style="color: #000;">Այս սկրիպտը պետք է գրվի Python ծրագրավորման լեզվով: Եթե դրան ծանոթ չեք, կամ անհրաժեշտ է թարմացնել հիմունքները, օգտագործեք <a href="https://docs.python.org/3/tutorial/index.html" target="_blank" rel="nofollow">հղումը</a>.</span>

<span style="color: #000;">Կախված առաջադրանքից, մակարդակը կարող է կազմավորվել տարբեր ձևերով: Սեղմելով «Վերականգնել մակարդակը» կոճակը, դուք ստանում եք լուծմսն տարբերակներ նախնական պայմանների համար: Երբեմն մակարդակը կայուն կլինի նույն փոփոխական արժեքներով:</span>

<span style="color: #000;">Մակարդակն անցնելու համար հարկավոր է ներմուծել «console» մոդուլը, որն օգտագործվում է «console» փոփոխականների հետ աշխատելու համար։</span>
```python
import console
```

<span style="color: #000;">Դուք կարող եք աշխատել «console» փոփոխականների հետ `օգտագործելով հետևյալ մեթոդները։</span>
* ```python
    console.get_value("name")
    ```
    <p style="color: #000;">Ստանալ փոփոխականի արժեքը</p>

* ```python
    console.set_value("name", value)
    ```
    <p style="color: #000;">Նշել փոփոխականի արժեքը.</p>

* ```python
    print()
    ```
    <p style="color: #000;">Ցուցադրել նշված հաղորդագրությունը կամ փոփոխական արժեքը վահանակի էկրանին</p>

#### <span style="color: #000;">Օրինակներ</span> 
##### <span style="color: #000;">Առաջադրանք</span>
<p style="color: #000;">A և B փոփոխականների արժեքը ավելացնել C փոփոխականին և ցուցադրել / տպել այս արժեքը «console» վահանակի վրա:</p>

##### <span style="color: #000;">Լուծում</span>
```python
import console
sum = console.get_value('a') + console.get_value('b')
console.set_value("c", sum)
print console.get_value("c")
```