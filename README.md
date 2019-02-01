# **Stockgames** - aplikacja webowa

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