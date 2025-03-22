<?php
    $csvFile = "C:/xampp/htdocs/POS-main/Reciept_Info.csv";

    if (!file_exists($csvFile)) {
        die("<tr><td colspan='2'>Error: File not found at " . realpath($csvFile) . "</td></tr>");
    }

    if (($handle = fopen($csvFile, "r")) !== FALSE) {
        fgetcsv($handle); 
        while (($row = fgetcsv($handle)) !== FALSE) {
            echo "<tr>";
            echo "<td>{$row[0]}</td>"; 
            echo "<td>{$row[1]}</td>";
            echo "</tr>";
        }
        fclose($handle);
    } else {
        die("<tr><td colspan='2'>Error: Unable to open file.</td></tr>");
    }
?>
