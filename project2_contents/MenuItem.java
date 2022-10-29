import java.sql.*;
import java.util.*;

import javax.naming.spi.DirStateFactory.Result;
/**
 * This class represents a menu item and its associated values (price, name, etc). 
 */
public class MenuItem {
    String itemName;
    double currPrice;
    boolean customizedOrder = false;
    boolean isGameDay = false;

    
    //Note: String key is is lowercase, not camelcase
    HashMap<String, Double> ingredients = new HashMap<String,Double>(); //<Ingredient Name, Quantity of Ingred> 

    /**
     * Constructor for setting all the components of a menu item based on its name
     * <p>
     * This method does not have a return value, but it loads menu item with current price in DB
     * @param _itemName 
     */

    public MenuItem(String _itemName) {
        itemName = _itemName;

        // setting MenuItem current price
        String priceQuery = "select itemprice from menu_items where itemname='" + itemName + "';";
        ResultSet priceResult = dbConnection.oneLinerQuery(priceQuery);

        //creating ingredient map for item
        String ingredMapQuery = "SELECT * FROM ingredient_map WHERE itemname = '"+ itemName +"';";
        ResultSet ingredResult = dbConnection.oneLinerQuery(ingredMapQuery);

        //creating ingredients arraylist for item
        String ingredQuery = "select ingredient from inventory;";
        ResultSet ingredListResult = dbConnection.oneLinerQuery(ingredQuery);

        try {
            // setting currPrice
            while (priceResult.next()) {
                currPrice = priceResult.getDouble("itemprice");
                // System.out.println(currPrice); //print for debugging
            }


            //setting ingredients
            ResultSetMetaData ingredMD = ingredResult.getMetaData();
            while(ingredResult.next()){
                for (int i = 2; i < ingredMD.getColumnCount() + 1; i++){
                    String quantity = ingredResult.getString(i);
                    ingredients.put(ingredMD.getColumnName(i), Double.parseDouble(quantity));
                    // System.out.println(ingredMD.getColumnName(i)  + " :: " + quantity); //For Debugging
                }
            }

            

            

        } catch (Exception e) {
            e.printStackTrace();
            System.err.println(e.getClass().getName() + ": " + e.getMessage());
            System.err.println("Error in MenuItem Constructor :: itemName = " + itemName);
            System.exit(0);
        }
    }

    /**
     * Getter that returns the name of the item
     */
    public String getItemName() {
        return this.itemName;
    }

    /**
     * Setter that sets the name of the item
     */
    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    /**
     * Getter that returns the current price of the item
     */
    public double getCurrPrice() {
        return this.currPrice;
    }

    /**
     * Setter that sets the current price
     */
    public void setCurrPrice(double currPrice) {
        this.currPrice = currPrice;
    }

    
    /**
     * Getter that returns the customized order
     */
    public boolean getCustomizedOrder() {
        return this.customizedOrder;
    }

    /**
     * Setter that sets the customized order
     */
    public void setCustomizedOrder(boolean customizedOrder) {
        this.customizedOrder = customizedOrder;
    }

    /**
     * Getter that returns the whether it is game day
     */
    public boolean getIsGameDay() {
        return this.isGameDay;
    }

    /**
     * Setter that sets whether it is game day
     */
    public void setIsGameDay(boolean isGameDay) {
        this.isGameDay = isGameDay;
    }

    /**
     * Returns a string containing the source text segment which was defined by the function
     * <p>
     * This method does not have a return value, but it does return a string with all of the values
     */
    @Override
    public String toString() {
        return "{" +
                " itemName='" + getItemName() + "'" +
                ", currPrice='" + getCurrPrice() + "'" +
                ", customizedOrder='" + getCustomizedOrder() + "'" +
                ", isGameDay='" + getIsGameDay() + "'" +
                "}";
    }

    public MenuItem MenuItem(String item_name) {
        return null;
    }



}
