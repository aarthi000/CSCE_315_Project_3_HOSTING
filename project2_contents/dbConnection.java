import java.sql.*;



/**
 * This class allows the java files to communicate with the database.
 */
public class dbConnection {
    /*
     *  openConn(): Opens connection, returns Connection object to use for queries.
     */
    
    public static Connection openConn() {
        Connection conn = null;
        String teamNumber = "16";
        String sectionNumber = "970";
        String dbName = "csce315_" + sectionNumber + "_" + teamNumber;
        String dbConnectionString = "jdbc:postgresql://csce-315-db.engr.tamu.edu/" + dbName;
        dbSetup myCredentials = new dbSetup();

        // Connecting to the database
        try {
            conn = DriverManager.getConnection(dbConnectionString, myCredentials.user, myCredentials.pswd);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println(e.getClass().getName() + ": " + e.getMessage());
            System.exit(0);
        }

        // System.out.println("Opened database successfully"); // FLAG: comment out when done building
        return conn;
    }

    //Same function as openConn, but opens conneection with alternate credentials
    public static Connection openConn_spec() {
        Connection conn = null;
        String teamNumber = "16";
        String sectionNumber = "970";
        String dbName = "csce315_" + sectionNumber + "_" + teamNumber;
        String dbConnectionString = "jdbc:postgresql://csce-315-db.engr.tamu.edu/" + dbName;
        dbSetup2 myCredentials = new dbSetup2();

        // Connecting to the database
        try {
            conn = DriverManager.getConnection(dbConnectionString, myCredentials.user, myCredentials.pswd);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println(e.getClass().getName() + ": " + e.getMessage());
            System.exit(0);
        }

        // System.out.println("Opened database successfully"); // FLAG: comment out when done building
        return conn;
    }

    /*
     * closeConn(Connection conn): closes connection given Connection parameter
     */
    public static void closeConn(Connection conn) {
        try {
            conn.close();
            // System.out.println("Connection Closed."); // FLAG: comment out after done
        } catch (Exception e) {
            System.out.println("Connection NOT Closed."); // FLAG: comment out after done
        }
    }


    /*
     * sendQuery(Connection conn, String queryString): sends query to DB, returns Result
     */
    public static ResultSet sendQuery(Connection conn, String queryString) {
        ResultSet result = null;
        try {
            Statement stmt = conn.createStatement();

            String sqlStatement = queryString;

            result = stmt.executeQuery(sqlStatement);

        } catch (Exception e) {
            System.out.println("Error accessing Database :: Query String :: " + queryString);

        }

        return result;
    }

    /*
     * oneLinerQuery(query): Meant for oneliner queries. Not efficient for multiple queries (use batched queries). 
     */
    public static ResultSet oneLinerQuery(String queryString){
        Connection conn = openConn();
        ResultSet result = sendQuery(conn, queryString);
        closeConn(conn);

        return result;

    }


    //uses alternate credentials to send oneliner query to mySQL
    public static ResultSet oneLinerQuery_spec(String queryString){
        Connection conn = openConn_spec();
        ResultSet result = sendQuery(conn, queryString);
        closeConn(conn);

        return result;

    }


}
