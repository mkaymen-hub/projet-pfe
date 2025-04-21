package org.example.pfe.service;
/*
import com.opencsv.CSVReader;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;


import java.io.FileReader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

@Service
public class CsvToOracle {

    private static final String FILE_PATH = "C:/Users/1000 TEK/Desktop/fichier_csv_msc/cdr_msc_detail.csv";
    private static final String DB_URL = "jdbc:oracle:thin:@localhost:1521/orclpdb";
    private static final String DB_USERNAME = "spring_user";
    private static final String DB_PASSWORD = "spring_pass";

    @PostConstruct
    public void init() {
        loadCsvToDatabase();
    }

    public void loadCsvToDatabase() {
        try (CSVReader reader = new CSVReader(new FileReader(FILE_PATH));
             Connection conn = DriverManager.getConnection(DB_URL, DB_USERNAME, DB_PASSWORD)) {

            String[] nextLine;
            reader.readNext();  // Ignore the header row
            System.out.println("Début de lecture du fichier CSV...");

            // La requête SQL sans paramètres
            String sqlTemplate = "INSERT INTO Ra_T_MSC_CDR_DETAIL (" +
                    "START_DATE, START_HOUR, CALLING_NO_GRP, A_IMSI, A_MSISDN, " +
                    "A_MSISDN_ORIG, CALLED_NO_GRP, B_MSISDN, B_MSISDN_ORIG, CALL_REFERENCE, CALL_TYPE, " +
                    "CAUSE_FOR_CLOSING, CELL_ID, C_NUM, C_NUM_ORIG, EVENT_DURATION, EVENT_STATUS, " +
                    "EVENT_TYPE, FILENAME, FILTER_CODE, IMEI, LAST_PARTIAL, NE, ORIG_START_TIME, " +
                    "PARTIAL_SEQ_ID, PARTNER, RECORD_TYPE, SERVED_MSRN, SUBSCRIBER_TYPE, MVNO_TAG, " +
                    "TELESERVICE, PORTABILITY_FLAG, TRUNK_IN, TRUNK_OUT, INTERCO, CALLED_NO_MNP_INFO, " +
                    "FLEX_FLD1, FLEX_FLD2, FLEX_FLD3, FLEX_FLD4) VALUES (";

            int count = 0;
            while ((nextLine = reader.readNext()) != null) {
                System.out.println("Ligne lue : " + String.join(" | ", nextLine));

                // Dynamically build the placeholders for the prepared statement
                String placeholders = String.join(",", java.util.Collections.nCopies(nextLine.length, "?"));
                String sql = sqlTemplate + placeholders + ")";

                try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
                    conn.setAutoCommit(false); // Désactiver l'auto-commit pour améliorer les performances

                    // Set each parameter in the prepared statement
                    for (int i = 0; i < nextLine.length; i++) {
                        pstmt.setString(i + 1, nextLine[i]);
                    }

                    pstmt.executeUpdate();
                    count++;
                } catch (Exception e) {
                    // En cas d'exception, annuler la transaction
                    System.out.println("Erreur rencontrée, annulation de la transaction...");
                    e.printStackTrace();
                    try {
                        conn.rollback(); // Faire le rollback
                    } catch (Exception rollbackEx) {
                        rollbackEx.printStackTrace();
                    }
                    break;  // Stopper le processus si une erreur survient
                }
            }

            conn.commit(); // Effectuer le commit après toutes les lignes
            System.out.println("Nombre de lignes insérées : " + count);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
*/
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.Collections;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;@Service
public class CsvToOracle {

    private static final String FILE_PATH = "C:/Users/1000 TEK/Desktop/fichier_csv_msc/cdr_msc_detail.csv";
    private static final String DB_URL = "jdbc:oracle:thin:@localhost:1521/orclpdb";
    private static final String DB_USERNAME = "spring_user";
    private static final String DB_PASSWORD = "spring_pass";

    @PostConstruct
    public void init() {
        loadCsvToDatabase(); // Cette méthode s'exécute automatiquement au démarrage
    }

    public void loadCsvToDatabase() {
        try (CSVReader reader = new CSVReader(new FileReader(FILE_PATH));
             Connection conn = DriverManager.getConnection(DB_URL, DB_USERNAME, DB_PASSWORD)) {

            String[] nextLine;
            reader.readNext();  // Ignore the header row
            System.out.println("Début de lecture du fichier CSV...");

            // La requête SQL sans paramètres pour l'insertion
            String sqlTemplate = "INSERT INTO RA_T_MSC_CDR_DETAIL (" +
                    "START_DATE, START_HOUR, CALLING_NO_GRP, A_IMSI, A_MSISDN, " +
                    "A_MSISDN_ORIG, CALLED_NO_GRP, B_MSISDN, B_MSISDN_ORIG, CALL_REFERENCE, CALL_TYPE, " +
                    "CAUSE_FOR_CLOSING, CELL_ID, C_NUM, C_NUM_ORIG, EVENT_DURATION, EVENT_STATUS, " +
                    "EVENT_TYPE, FILENAME, FILTER_CODE, IMEI, LAST_PARTIAL, NE, ORIG_START_TIME, " +
                    "PARTIAL_SEQ_ID, PARTNER, RECORD_TYPE, SERVED_MSRN, SUBSCRIBER_TYPE, MVNO_TAG, " +
                    "TELESERVICE, PORTABILITY_FLAG, TRUNK_IN, TRUNK_OUT, INTERCO, CALLED_NO_MNP_INFO, " +
                    "FLEX_FLD1, FLEX_FLD2, FLEX_FLD3, FLEX_FLD4) VALUES (";

            int count = 0;
            while ((nextLine = reader.readNext()) != null) {
                System.out.println("Ligne lue : " + String.join(" | ", nextLine));

                // Dynamically build the placeholders for the prepared statement
                String placeholders = String.join(",", java.util.Collections.nCopies(nextLine.length, "?"));
                String sql = sqlTemplate + placeholders + ")";

                try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
                    conn.setAutoCommit(false); // Désactiver l'auto-commit pour améliorer les performances

                    // Set each parameter in the prepared statement
                    for (int i = 0; i < nextLine.length; i++) {
                        pstmt.setString(i + 1, nextLine[i]);
                    }

                    pstmt.executeUpdate();
                    count++;
                } catch (Exception e) {
                    // En cas d'exception, annuler la transaction
                    System.out.println("Erreur rencontrée, annulation de la transaction...");
                    e.printStackTrace();
                    try {
                        conn.rollback(); // Faire le rollback
                    } catch (Exception rollbackEx) {
                        rollbackEx.printStackTrace();
                    }
                    break;  // Stopper le processus si une erreur survient
                }
            }

            conn.commit(); // Effectuer le commit après toutes les lignes
            System.out.println("Nombre de lignes insérées dans RA_T_MSC_CDR_DETAIL : " + count);

            // Mise à jour de la date de chargement dans la table de suivi des flux
            updateFluxStatus(count);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public void updateFluxStatus(int count) {
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USERNAME, DB_PASSWORD)) {
            LocalDateTime date = LocalDateTime.now();
            Timestamp timestamp = Timestamp.valueOf(date);
            String status = (count > 0) ? "UP" : "DOWN";
            String nomFlux = "MSC"; // ou rendre dynamique selon le fichier traité

            // INSERT
            String sqlInsert = "INSERT INTO CHARGEMENT (DATE_CHARGEMENT, STATUT, NOM_FLUX) VALUES (?, ?, ?)";

            try (PreparedStatement pstmt = conn.prepareStatement(sqlInsert)) {
                pstmt.setTimestamp(1, timestamp);
                pstmt.setString(2, status);
                pstmt.setString(3, nomFlux);
                pstmt.executeUpdate();
            }

            System.out.println("Nouvelle ligne insérée dans CHARGEMENT : " + nomFlux + " -> " + status);

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }


}

