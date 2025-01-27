# Abgabe Softwarequalität Wintersemester 2024/25
Fachhochschule Südwestfalen, B.Sc. Angewandte Informatik Verbund


## Teammitglieder
Kevin Kijas | Matrikelnummer: 30256695 | Frontend

Leonhard Suttmann | Matrikelnummer: 30248865 | Backend

Josip Brkic | Matrikelnummer: 30248427 | Sonarqube

## Vorgehensweise
1. Forken des Repositories / Aufgabenteilung

Zu Beginn der Aktivitäten wurde gemäß der Aufgabenstellung ein Fork des originalen Repositories erstellt. Im Anschluss erfolgte die Aufteilung der Aufgaben in Frontend, Backend sowie Github-Actions/Sonarqube. Die Mitglieder des Teams entwickelten in eigenen Branches. Dies hat den Vorteil, dass die jeweiligen Tätigkeiten unanhängig von denen der anderen Entwickler durchgeführt werden konnten.

2. Überblick verschaffen

Bevor die Testszenarien entwickelt wurden, haben wir uns gemeinschaftlich einen Überblick über die Applikation an sich, augenscheinliche Fehler bei der Bedienung im Frontend und den existierenden Quellcode verschafft. Die Anforderungen an die Applikation oder Use Cases waren nicht bekannt und mussten sinnhaft abgeleitet werden.

3. Erstellung von Unit- und End2End-Tests

Der Fokus lag zunächst auf den Unit-Tests des Backends. Die bestehenden Tests, die in der Datei "/backend/todo.test.js" bereits angelegt waren, wurden zu Beginn analysiert und manuell über das Kommando 'npm test' getestet. Für die Weiterentwicklung der Unit-Tests wurden die üblichen Operationen CRUD (Create, Read, Update, Delete) zugrunde gelegt, da keine Dokumentation der Use Cases vorlag.
Die Frontend-Tests wurden auf Basis der NodeJS Erweiterung Cypress erstellt. Die notwendige Verzeichnisstruktur '/todo/frontend/cypress/e2e' wurde vorab angelegt. Der Aufbau der Testsystematik folgt dem bereits oben beschriebenen Schema der CRUD-Operationen, sowie dem Test des erfolgreichen Aufrufs der Startseite.

4. Einrichten der GitHub-Action und Integration von SonarQube

Die Github-Actions wurden so konfiguriert, dass sie sowohl auf push- als auch pull-Requests des Branches "main" reagieren. Im Anschluss erfolgt ein sequentieller Ablauf der Testaufrufe 'Backend-Test' und 'Frontend-Test'. Letztendlich folgt der Schritt 'SonarQube-Analysis'. Die Aufrufe sind in der "test.yml"-Datei konfiguriert und parametrisiert. Für die erfolgreiche Analyse des Codes in Sonarqube wurden auf der Plattform ein neues Projekt mit dem Namen "ls_kk_jb_todo" angelegt und ein gleichlautendes Token für den API-Zugriff generiert. Beim Anlegen des Tokens ist auf das Ablaufdatum zu achten, welches im Standard 30 Tage beträgt und bei der Laufzeit des Projektes berücksichtigt werden sollte. Das Token wurde als Secret im Repository gespeichert und in der Konfigurationsdatei "sonar-project.properties" statisch hinterlegt. Als Quality Gate ist "TODO_RWTH" vorkonfiguriert und enthält folgende Qualitätsmerkmale, die als erster Anhaltspunkt für die qulitative Bewertung des Codes dienen. Des weiteren lässt sich bei der Auswertung zwischen "Overall Status" und "New Code" unterscheiden, was eine Analyse der Neuentwicklung als Delta zum bestehenden Projekt ermöglicht.

| Metric | Operator | Value |
| ------------- | ------------- |  ------------- | 
| Issues | is greater than | 0 |
| Security Hotspots Reviewed | is less than | 100% |
| Coverage | is less than | 80.0% |
| Duplicated Lines (%) | is greater than | 20.0% |


## Gewählte Lösungen
### Unit-Tests

| **Endpunkt**          | **Testbeschreibung**                                                                                 | **Erwartetes Ergebnis**                                                                                       | **HTTP-Status** |
|-----------------------|-----------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|-----------------|
| `GET /todos` (unautorisiert) | Gibt einen Fehler zurück, wenn kein Token bereitgestellt wird                                       | Fehlernachricht: `Unauthorized`                                                                              | `401`           |
| `GET /todos`          | Gibt eine leere Liste zurück, wenn keine Todos vorhanden sind                                           | Leere Liste: `[]`                                                                                             | `200`           |
| `GET /todos`          | Gibt eine Liste aller vorhandenen Todos zurück                                                          | Array mit Todos                                                                                               | `200`           |
| `POST /todos`         | Erstellt ein neues Todo                                                                                | Gibt das erstellte Todo mit seinen Eigenschaften zurück                                                       | `201`           |
| `POST /todos`         | Gibt einen Fehler zurück, wenn das Todo unvollständig ist                                              | Fehlernachricht                                                                                               | `400`           |
| `POST /todos`         | Gibt einen Fehler zurück, wenn das Datum ungültig ist                                                  | Fehlernachricht                                                                                               | `400`           |
| `GET /todos/:id`      | Ruft ein spezifisches Todo ab                                                                          | Das gewünschte Todo wird zurückgegeben                                                                        | `200`           |
| `GET /todos/:id`      | Gibt einen Fehler zurück, wenn das Todo nicht gefunden wurde                                           | Fehlernachricht                                                                                               | `404`           |
| `PUT /todos/:id`      | Aktualisiert ein spezifisches Todo                                                                     | Gibt das aktualisierte Todo zurück                                                                            | `200`           |
| `PUT /todos/:id`      | Gibt einen Fehler zurück, wenn die ID im Body nicht mit der ID im Pfad (URL) übereinstimmt                   | Fehlernachricht                                                                                               | `400`           |
| `PUT /todos/:id`      | Gibt einen Fehler zurück, wenn das Todo nicht existiert                                               | Fehlernachricht                                                                                               | `404`           |
| `DELETE /todos/:id`   | Löscht ein spezifisches Todo                                                                           | Kein Inhalt                                                                                                   | `204`           |
| `DELETE /todos/:id`   | Gibt einen Fehler zurück, wenn das Todo nicht existiert                                               | Fehlernachricht                                                                                               | `404`           |


### End2End-Tests

| Testfall                                  | Beschreibung                                                                                       | Schritte                                                                                           | Erwartetes Ergebnis                                                                                                   |
|-------------------------------------------|---------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| **App lädt erfolgreich**                  | Überprüft, ob die Todo-App erfolgreich geladen wird.                                              | - Besuche die URL der App: `http://localhost:<PORT>/todo.html`.                                   | Die Seite wird erfolgreich geladen.                                                                                   |
| **Neues Todo hinzufügen und anzeigen**    | Fügt ein neues Todo hinzu und stellt sicher, dass es in der Liste angezeigt wird.                | - Fülle das Feld "Todo" mit "Neue Aufgabe". <br> - Wähle das Fälligkeitsdatum. <br> - Wähle den Status "offen". <br> - Klicke auf "Submit". | Das neue Todo wird mit dem Titel, Datum und Status in der Liste angezeigt.                                            |
| **Fehlermeldung: Kein Titel eingegeben**  | Zeigt eine Fehlermeldung, wenn kein Titel eingegeben wurde.                                       | - Lasse das Feld "Todo" leer. <br> - Wähle ein Fälligkeitsdatum. <br> - Klicke auf "Submit".      | Es erscheint eine Fehlermeldung, die darauf hinweist, dass der Titel erforderlich ist.                                |
| **Fehlermeldung: Datum in der Vergangenheit** | Zeigt eine Fehlermeldung, wenn ein Fälligkeitsdatum in der Vergangenheit liegt.                   | - Fülle das Feld "Todo" mit einem Titel. <br> - Gib ein Fälligkeitsdatum in der Vergangenheit ein. <br> - Klicke auf "Submit". | Es erscheint eine Fehlermeldung, die darauf hinweist, dass das Datum nicht in der Vergangenheit liegen darf.          |
| **Status eines Todos ändern**             | Ändert den Status eines bestehenden Todos.                                                       | - Füge ein Todo hinzu. <br> - Klicke auf den Status des Todos, um ihn zu ändern.                 | Der Status des Todos ändert sich (z. B. von "offen" zu "in Bearbeitung").                                             |
| **Todo löschen**                          | Löscht ein bestehendes Todo aus der Liste.                                                       | - Füge ein Todo hinzu. <br> - Klicke auf die Schaltfläche "Löschen" des entsprechenden Todos.     | Das Todo wird aus der Liste entfernt und ist nicht mehr sichtbar.                                                     |

### Weitere Tests
- **SonarQube**: statische Code-Analyse.
- **CI-Pipeline**: GitHub Actions.

## Fehlerbehebung

| Problem | Lösung |
| ------------- | ------------- |
|Beim Updaten von todos werden diese nicht validiert  | In der index.js die todoValidationRules für app.put hinzugefügt |
|Todos können nicht angelegt/geladen werden | Übertragen eines Authorization headers durch das Frontend |
|Todos können nicht gelöscht werden | Datentyp der ID im Frontend korrigiert |
|Todo wird im Frontend gelöscht, auch wenn ein Fehler im Backend aufgetreten ist | Todos erst nach Bestätigung vom Backend entfernen |
|Status in todo.html depricated | umbenennen der liste in status_label 
|Throw ohne object verwendet | throw new Error('Fehler') verwenden
|Fälschlicherweise let statt const genutzt | const verwenden
|Backend legt Versionsinformationen offen | Hinzufügen von app.disable("x-powered-by"); in index.js
|In der todo.html HTML-Sprache nicht angegeben | \<html lang="de"> hinzugefügt
|Sonarqube sieht jeden Kommentar mit "todo" als Arbeitsauftrag | issue als Fehltreffer markieren / Kommentar ändern
|Ungenutzte imports | imports entfernen
|Formular behält bei Nutzung immer den status des letzten Todos bei | Zurücksetzen des Status auf offen
|Beim bearbeiten eines Todos wird ein neues angelegt | die Frontend-Funktion saveTodo hat die id als falschen Datentyp abgespeichert
|In Cypress führt die Eingabe von einem Datum zu einem Fehler | Formatierung des Datums in Cypress angepasst
|Im Frontend-Test ist die Datenbank aus Backend-Testaktivität nicht leer | Backend vor Beginn der Frontend-tests neu initialisieren 
|Keycloak Authentifizierungsinformationen im Backend Quellcode im Klartext enthalten (utils.js) | Speichern der Daten in Umgebungsvariablen

## Ergebnisse
- **Tests**: Erfolgreich.
- **SonarQube-Bericht**: 83,9% Coverage, 0 Bugs.
