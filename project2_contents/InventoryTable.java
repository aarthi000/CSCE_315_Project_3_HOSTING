import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.sql.*;
import java.text.SimpleDateFormat;


import javax.sound.midi.Track;
import javax.swing.JFrame;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.table.AbstractTableModel;
import javax.swing.table.DefaultTableModel;
import javax.swing.border.Border;
import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionListener;
import javax.swing.event.*;
import java.awt.event.*;
import java.util.Map;

/**
 * This class contains the frontend and backend for the "Inventory" feature accessible to managers.
 */
public class InventoryTable extends JFrame {
    static JFrame f;

    static JComboBox<String> cBox;

    /**
     * Creates a window populated with an inventory table from database.
     * <p>
     * This method does not have a return value, but it does create the design for the inventory page.
     * This includes creating buttons and calling the action listener to setup for a specific action.
     * It also sets headings for the table, allows you to add/delete inventory, and restock.
     * @param o object that allows you to access all of the methods to manipulate the inventory
     */
    public InventoryTable(OrderWindow o) {
        JTable jTable1 = new JTable();
        Panel panel = new Panel();

        Dimension panelSize = new Dimension(400, 600);
        Color panelColor = new Color(255, 241, 241);
        panel.setPreferredSize(panelSize);
        panel.setBackground(panelColor);

        f = new JFrame("Inventory");
        f.setSize(650, 600);
        f.setLayout(new BorderLayout());
        f.getContentPane().setBackground(new Color(90, 6, 25));
        // DefaultTableModel model = new DefaultTableModel();
        DefaultTableModel model = new DefaultTableModel(
                new Object[] { "ingredients", "quanitity remaining", "amount used" }, 0);
        JScrollPane scrollPane = new JScrollPane();
        ArrayList<String> inven = o.AddOnsForGUI;

        String menuTableQuery = "select * from inventory;";

        ArrayList<ingredient> ingred = new ArrayList<ingredient>();

        ResultSet rs = dbConnection.oneLinerQuery(menuTableQuery);

        try {
            while (rs.next()) {
                String ingredient = rs.getString("ingredient");
                Double ingredientremaining = rs.getDouble("ingredientremaining");
                Double amountused = rs.getDouble("amountused");
                ingred.add(new ingredient(ingredient, ingredientremaining, amountused));

            }
        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
            System.err.println(e.getClass().getName() + ": " + e.getMessage());
            System.exit(0);

        }
        // Update inventory history
        updateInventoryHistory(ingred);

        int j = 0;
        for (int i = 0; i < inven.size(); i++) {
            if (j == 0) {
                Object[] rowData = new Object[3];
                rowData[0] = "Ingredient";
                rowData[1] = "Ingredients Remaining";
                rowData[2] = "Amount Used";
                model.addRow(rowData);
            }
            else {
                Object[] rowData = new Object[3];
                rowData[0] = ingred.get(i).ingredient;
                rowData[1] = ingred.get(i).ingredientremaining;
                rowData[2] = ingred.get(i).amountused;
                model.addRow(rowData);
            }  
            j++;  
        }
        jTable1.setModel(model);

        f.add(panel);
        panel.add(jTable1);
        panel.add(scrollPane);
        jTable1.setEnabled(true);
        f.setVisible(true);

        String[] invenList = new String[inven.size()];
        for (int i = 0; i < inven.size(); i++) {
            invenList[i] = inven.get(i);
        }

        cBox = new JComboBox<>(invenList);
        cBox.setBounds(60, 32, 200, 50);
        panel.add(cBox);

        JButton updateInven = new JButton("Update Stock");
        JButton addNewIngredient = new JButton("Add New Ingredient");
        JButton deleteNewIngredient = new JButton("Delete Ingredient");
        JButton salesReport = new JButton("Sales Report");
        JButton excessReport = new JButton("Excess Report");
        JButton restockReport = new JButton("Restock Report");
        JButton addReport = new JButton("Add-On Report");

        panel.add(updateInven);
        panel.add(addNewIngredient);
        panel.add(deleteNewIngredient);
        panel.add(salesReport);
        panel.add(excessReport);
        panel.add(restockReport);
        panel.add(addReport);

        updateInven.addActionListener(new OrderWindowActionListener(o, cBox));
        addNewIngredient.addActionListener(new OrderWindowActionListener(o, cBox));
        deleteNewIngredient.addActionListener(new OrderWindowActionListener(o, cBox));
        salesReport.addActionListener(new OrderWindowActionListener(o));
        excessReport.addActionListener(new OrderWindowActionListener(o));
        restockReport.addActionListener(new OrderWindowActionListener(o));
        addReport.addActionListener(new OrderWindowActionListener(o));


    }

   /*
    *  updateInvenotryHistory - this method updates the inventory_history table
    *                           If there is an entry today, then it will skip entering data
    *                           If not, it will insert an entry
    */
    private void updateInventoryHistory(ArrayList<ingredient> ingredList) {
	SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yy");
	Date date = new Date();
	String dateStr = formatter.format(date);

        String inventoryHistQueryStr = "SELECT date FROM inventory_history WHERE date = " + "'" + dateStr + "';";

        try {
            ResultSet rs = dbConnection.oneLinerQuery(inventoryHistQueryStr);
            // Date entry doesn't exist, so insert it
            if (!rs.next()) {
                String inventoryHistoryStr = "INSERT into inventory_history (";
                String columnNamesStr = "";
                String columnValuesStr = "";

                // Go through the ingredient list add them to column names and column values
                for (int i=0; i < ingredList.size(); i++) {
                    columnNamesStr += ingredList.get(i).ingredient;
                    columnValuesStr += ingredList.get(i).ingredientremaining;
                    if( i != ingredList.size()-1) {
                        columnNamesStr += ",";
                        columnValuesStr += ",";
                    }
                }
                // Create the insert statement
                inventoryHistoryStr += "date," + columnNamesStr + ") VALUES (" + "'" + dateStr + "'," + columnValuesStr +");";
                // Run the insert statement

                ResultSet rsNew = dbConnection.oneLinerQuery_spec(inventoryHistoryStr);
               
                
            }
        }
        catch (Exception e) {
           e.printStackTrace();
        }
       
    }
}
