# **JSQL Admin panel** - aplikacja webowa

Oprogramowanie opracowane przez firmę JSQL Sp. z o.o. w ramach prowadzonego projektu:

Opracowanie nowej metody procesu tworzenia oprogramowania poprzez optymalizację architektury warstwowej typu klient-serwer
Spółka JSQL sp. z.o.o. bierze udział w programie realizując projekt pt.:

“Opracowanie nowej metody procesu tworzenia oprogramowania poprzez optymalizację architektury warstwowej typu klient-serwer”

współfinansowanym przez Unię Europejską ze środków Regionalnego Programu Operacyjnego Województwa Zachodnipomorskiego 2014-2020

Oś priorytetowa 1 Gospodarka, Innowacje, Nowoczesne Technologie.
Działanie: 1.1. Projekty badawczo-rozwojowe przedsiębiorstw
Typ projektu 2

Projekty badawczo-rozwojowe przedsiębiorstw wraz z przygotowaniem do wdrożenia w działalności gospodarczej
Wartość Projektu: 1 380 501,67 PLN
Wkład Funduszy Europejskich: 1 090 679,25 PLN

Zakres i cel Projektu:
Przedmiotem Projektu jest opracowanie nowej metody procesu tworzenia oprogamowania poprzez optymalizację architektury warstwowej typu klient-serwer, dzięki której uzyskane zostaną znaczące ułatwienia oraz optymalizacje na wszystkich płaszczyznach tworzenia oraz utrzymywania oprogramownia, m.in. zmniejszony koszt zasobów ludzkich, zmniejszony koszt utrzymywania projektu, zmniejszona ilość kodu źródłoweog projektu, możliwości przesunięcia zasobów na inne projekty.

Proces badawczy składa się z 4 etapów/Zadań badawczych:
1. Opracowanie modelu teoretycznego nowej metody tworzenia oprogramowania JSQL
2. Eksperymenty badawcze – badania nad nową metodą tworzenia oprogramowania JSQL
3. Budowa i demonstracja prototypu nowej metody tworzenia oprogramowania JSQL
## Instrukcja dla programisty

#### 1. Środowisko pracy

Musisz mieć zainstalowane następujące narzędzia (globalnie):
* [bower](http://bower.io/)
* [grunt-cli](https://www.npmjs.com/package/grunt-cli)
* [npm](https://www.npmjs.org/)

Poniższe polecenie (w głównym katalogu projektu) zainstaluje komponenty wymagane przez aplikację (instalacja komponentów bower jest realizowana w zadaniu `postinstall`):

```sh
$ npm install
```

#### 2. Uruchamianie aplikacji

Aplikację mozna uruchamiać poleceniem:
```sh
$ npm start
```
które jest skrótem dla `grunt serve`.

#### 3. Uruchamianie testów

Testy można uruchomić poleceniem 
    `karma start`

Należy posiadać zainstalowane:
    `npm install -g karma-cli`

Konfiguracja karmy znajduje się w głównym katalogu projektu w pliku
    `karma.conf.js`

Nowe testy należy dodwać w wyżej wymienionym pliku w sekcji:
    `files:`

#### 4. Dystrybucja aplikacji

Do utworzenia wersji dystrybucyjnej użyj polecenia:
```sh
$ npm run dist
```
Jest to uproszczenie polecenia `grunt serve:dist`.  
Po poprawnym zakończeniu zadania źródła będą dostępne w katalogu *dist* (w głównym katalogu projektu).

#### Wykorzystywane narzędzia automatyzacji:

- [Grunt](http://gruntjs.com/)


#### 5. Hinty programisty
- Nie używaj $rootScope -> zamiast tego użyj Serwisu EventEmitter.service.js

#### 6. Custom directives
```sckCounter directiva based on
http://embed.plnkr.co/eRWPuEP8LdQBbHksIL3S/
```Angular Datepicker
https://github.com/720kb/angular-datepicker
