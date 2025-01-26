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
Die Frontend-Tests wurden auf Basis der NodeJS Erweiterung Cypress erstellt. Die notwendige Verzeichnisstruktur '/todo/frontend/cypress/e2e' wurde vorab angelegt. Der Aufbau der Testsystematik folgt dem bereits oben beschriebenen Schema der CRUD-Operaotionen, sowie dem Test des erfolgreichen Aufrufs der Startseite.

4. Einrichten der GitHub-Action und Integration von SonarQube

Die Github-Actions wurden so konfiguriert, dass sie sowohl auf push- als auch pull-Requests des Branches "main" reagieren. Im Anschluss erfolgt ein sequentieller Ablauf der Testaufrufe 'Backend-Test' und 'Frontend-Test'. Letztendlich folgt der Schritt 'SonarQube-Analysis'. Die Aufrufe sind in der "test.yml"-Datei konfiguriert und parametrisiert. Für die erfolgreiche Analyse des Codes in Sonarqube wurden auf der Plattform ein neues Projekt mit dem Namen "ls_kk_jb_todo" angelegt und ein gleichlautendes Token für den API-Zugriff generiert. Beim Anlegen des Tokens ist auf das Ablaufdatum zu achten, welches im Standard 30 Tage beträgt und bei der Laufzeit des Projektes berücksichtigt werden sollte. Das Token wurde als Secret im Repository gespeichert und in der Konfigurationsdatei "sonar-project.properties" statisch hinterlegt. Als Quality Gate ist "TODO_RWTH" vorkonfiguriert und enthält folgende Qualitätsmerkmale, die als erster Anhaltspunkt für die qulitative Bewertung des Codes dienen. Des weiteren lässt sich bei der Auswertung zwischen "Overall Status" und "New Code" unterscheiden, was eine Analyse der Neuentwicklung als Delta zum bestehenden Projekt ermöglicht.

| Metric | Operator | Value |
| ------------- | ------------- |  ------------- | 
| Issues | is greater than | 0 |
| Security Hotspots Reviewed | is less than | 100% |
| Coverage | is less than | 80.0% |
| Duplicated Lines (%) | is greater than | 20.0% |


## Gewählte Lösungen
- **Testfälle**: Unit-Tests mit Jest und MongoDB.
- **CI-Pipeline**: GitHub Actions mit MongoDB-Service.
- **SonarQube**: Konfiguration für statische Code-Analyse.

## Probleme und Lösungsansätze

| Problem | Lösungen |
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


## Ergebnisse
- **Tests**: Erfolgreich.
- **SonarQube-Bericht**: 83,9% Coverage, 0 Bugs.
