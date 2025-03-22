<?php
    $csvFile = "C:/xampp/htdocs/POS-main/Reciept_Info.csv";

    if (!file_exists($csvFile)) {
        die("<tr><td colspan='2'>Error: File not found at " . realpath($csvFile) . "</td></tr>");
    }

    if (($handle = fopen($csvFile, "r")) !== FALSE) {
        fgetcsv($handle); // Skip header row
        while (($row = fgetcsv($handle)) !== FALSE) {
            echo "<tr>";
            echo "<td>{$row[0]}</td>"; // SalesID
            echo "<td>{$row[1]}</td>"; // Status
            echo "</tr>";
        }
        fclose($handle);
    } else {
        die("<tr><td colspan='2'>Error: Unable to open file.</td></tr>");
    }
?>
