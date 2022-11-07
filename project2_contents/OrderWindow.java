import java.util.*;
import java.util.List;
import java.sql.*;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.math.RoundingMode;
import java.rmi.server.LoaderHandler;
import java.text.DecimalFormat;
import java.io.*;
import java.awt.*;
import java.awt.event.ActionEvent;

import javax.swing.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.time.temporal.ChronoUnit;

/**
 * This class contains the main backend functionality for the Order Window and overall GUI.
 */
public class OrderWindow {
    /*
     * Holds list of current menu items ordered prior to placing order.
     * Mix of MenuItems and CustomizedMenuItems.
     */
    public static final String MENU_ITEM_TABLE = "menu_item";

    /*Current Order MenuItems */
    public ArrayList<MenuItem> currOrder = new ArrayList<MenuItem>();
    public ArrayList<String> currOrderNames = new ArrayList<String>();
    boolean isGameDay = false;

    /*Stored items for new menu item */
    public String newItemName = "";
    public String newItemType = "";
    public Double newPrice = -1.0;
    public HashMap<String, Double> newIngredientMap = new HashMap<String,Double>();

    /*Constant ingredients and menu items from DB for population of GUI */
    public ArrayList<MenuItem> MenuItemsForGUI = new ArrayList<MenuItem>();
    public ArrayList<String> AddOnsForGUI = new ArrayList<String>();
    public ArrayList<ingredient> Ingredients = new ArrayList<ingredient>();

    public HashMap<String,Double> minValueIngredientMap = new  HashMap<String,Double> ();

    ArrayList<Object> prevOrderList;
    Boolean prevOrderExists = false;

    public HashMap<String, ArrayList<MenuItem>> orderPageMap = new HashMap<String, ArrayList<MenuItem>>();

    public static String itemTypes[] = { Proj2HelperClass.BURGERS, Proj2HelperClass.SIDES,
            Proj2HelperClass.SANDWICHES, Proj2HelperClass.SALADS,
            Proj2HelperClass.DESSERTS, Proj2HelperClass.DRINKS };

    /**
     * [OrderWindow is the constructor for that loads the menu items into the GUI and also loads the add
     *              ons by calling both respective functions]
     * @throws SQLException [throws an SQL exception if the menu items cant be loaded or the add ons can't be loaded]
     */
    public OrderWindow() throws SQLException {
        loadMenuItemsForGUI();
        loadAddOnsForGUI();
    }

    /**
     * [restockInventory restocks the inventory in the database]
     * @param  ingredient                    [An ingredient that is passed as a string as we need to know what ingredient to restock]
     * @param  amountRestocked               [A number that is passed as a double that represents the specific amount of 'ingredient'
     *                                        to be restocked]
     * @throws SQLException    [throws a]
     */
    public void restockInventory(String ingredient, Double amountRestocked) throws SQLException {

        Connection conn = dbConnection.openConn();
        Statement stmt = conn.createStatement();
        String remainingQuery = "update inventory set ingredientremaining=ingredientremaining+" + amountRestocked
                + " where ingredient='" + ingredient + "';";
        String usedQuery = "update inventory set amountused=0 where ingredient='" + ingredient + "';";
        stmt.addBatch(remainingQuery);
        stmt.addBatch(usedQuery);
        stmt.executeBatch();
        dbConnection.closeConn(conn);

    }

    /**
     * [changeMinimumAmount changes the minimum amount in the inventory for a specific ingredient]
     * @param  ingredient                    [An ingredient that is passed as a string as we need to know what ingredient to restock]
     * @param  amountRestocked               [A number that is passed as a double that represents the specific amount of 'ingredient'
     *                                        to be restocked]
     * @throws SQLException    [throws a]
     */
    public void changeMinimumAmount(String ingredient, Double minimumVal) throws SQLException {

        String minValueQuery = "update inventory set minimumamount=" + minimumVal
                + " where ingredient='" + ingredient + "';";
        ResultSet result = dbConnection.oneLinerQuery(minValueQuery); 
    }

    /**
     * [loadMenuItemsIntoHashMap: loads menu items into MenuItemsForGUI ArrayList to
     * generate menuitems. Run general query and get all rows from menu items. If this itemType already exists in the HashMap,
     * then just add to that ArrayList. Check if there is a hashmap entry for this type of item If the type doesn't exist then create a HashMap]
     */
    public void loadMenuItemsIntoHashMap() throws SQLException {
        String menuItemMapQuery = "select * from menu_items;";

        ResultSet rs = dbConnection.oneLinerQuery(menuItemMapQuery);

        while (rs.next()) {

            ArrayList<MenuItem> menuItemList = null;
            String itemType = rs.getString("itemtype");
            menuItemList = orderPageMap.get(itemType);
            if (menuItemList == null) {
                menuItemList = new ArrayList<MenuItem>();
                orderPageMap.put(itemType, menuItemList);
            }
            String itemName = rs.getString("itemname");
            MenuItem menuItem = new MenuItem(itemName);

            menuItemList.add(menuItem);
        }
        rs.close();
    }


    /**
     * [loadMenuItemsForGUI loads the Menu Items to the GUI]
     * @throws SQLException [SQL exception is thrown if the menu items can't be loaded]
     */
    public void loadMenuItemsForGUI() throws SQLException {

        String menuTableQuery = "select itemname from menu_items;";
        ResultSet rs = dbConnection.oneLinerQuery(menuTableQuery);

        while (rs.next()) {
            String itemname = rs.getString("itemname");
            MenuItemsForGUI.add(new MenuItem(itemname));

        }


    }

    /**
     * [loadAddOnsForGUI loads all ingredients into AddOnsForGUI ArrayList to generate add-ons for customizeWindow.]
     */
    public void loadAddOnsForGUI() throws SQLException {

        String menuTableQuery = "select * from inventory;";
        ResultSet rs = dbConnection.oneLinerQuery(menuTableQuery);


        while (rs.next()) {
            String ingredient = rs.getString("ingredient");
            Double ingredientremaining = rs.getDouble("ingredientremaining");
            Double amountused = rs.getDouble("amountused");
            Double minimumamount = rs.getDouble("minimumamount");

            AddOnsForGUI.add(ingredient);
            Ingredients.add(new ingredient(ingredient, ingredientremaining, amountused,minimumamount));

        }


    }

    public void createIngredient(String ingredient) throws SQLException {
        createIngredient(ingredient, 5.0, 30.0, 0.0);
    }
    public void createIngredient(String ingredient, Double minimumamount) throws SQLException {
        createIngredient(ingredient, minimumamount, 30.0, 0.0);
    }
    public void createIngredient(String ingredient, Double minimumamount, Double ingredientremaining) throws SQLException {
        createIngredient(ingredient, minimumamount, ingredientremaining, 0.0);
    }

    /*
     * [createIngredient creates and ingredient and inserts into the inventory table in DB]
     * @param  ingredient                 [string 'ingredient' passed to specify the new ingredient to create]
     */
    public void createIngredient(String ingredient,Double minimumAmount,Double ingredientRemaining, Double amountUsed) throws SQLException {
        String inventoryQuery = "INSERT into inventory (" + 
                         "ingredient, ingredientremaining, amountused,minimumamount) VALUES ('"
                         + ingredient          + "'" + ","  
                         + ingredientRemaining + "," 
                         + amountUsed          + "," 
                         + minimumAmount       + ");";
                        //30.0, 0.0,5.0);";

        // add to ingredient_map DB
        String mapQuery = "ALTER TABLE ingredient_map ADD COLUMN " + ingredient + " DOUBLE PRECISION;";
        String addonQuery = "ALTER TABLE addons_history ADD COLUMN " + ingredient + " DOUBLE PRECISION;";

        String initializeWithZeros = "UPDATE ingredient_map SET " + ingredient + " = 0.0;";

        Connection conn = dbConnection.openConn();
        Statement stmt = conn.createStatement();
        stmt.addBatch(inventoryQuery);
        stmt.addBatch(mapQuery);
        stmt.addBatch(initializeWithZeros);

        stmt.executeBatch();
        conn.close();

        //for addons query
        Connection c = dbConnection.openConn_spec();
        Statement s = c.createStatement();
        s.addBatch(addonQuery);
        s.executeBatch();
        c.close();


    }

    /**
     * [deleteIngredient deletes an ingredient from the ingredient_map table in DB]
     * @param  ingredient                 [String 'ingredient' passed to specify the ingredient to delete from the DB]
     */
    public void deleteIngredient(String ingredient) throws SQLException{
        ResultSet rs= dbConnection.oneLinerQuery("Select "+ingredient+" from ingredient_map;");
        while (rs.next()){
            if (rs.getDouble(ingredient) != 0){
                loadErrorWindow("This ingredient is used in existing menu item, so you cannot delete it.");
                return;
            }
        }

        String deleteMap = "alter table ingredient_map drop column "+ ingredient+";";
        String deleteInventory = "Delete from inventory where ingredient='"+ ingredient +"';";

        Connection conn = dbConnection.openConn();
        Statement stmt = conn.createStatement();
        stmt.addBatch(deleteMap);
        stmt.addBatch(deleteInventory);
        stmt.executeBatch();
        conn.close();
    }

    /**
     * getItemListByType: getItemList is used by caller to populate Order window
     * list of menu items from the HashMap
     * If customer chooses "burgers', then the caller will call this method as
     * getItemList("burgers");
     *
     * @param itemType is a string of the itemType, either burger, drink, sides,
     *                 desserts, or sandiwich
     * @return an array list of of Menu Items of type itemType
     */
    public ArrayList<MenuItem> getItemListByType(String itemType) {
        return orderPageMap.get(itemType);
    }

    /**
     * [Adds new item to menu when pressed. Has internal checks to protext against bad input.]
     */
    public void addNewItem_button(){
        if (newItemName.equals("")){
            loadErrorWindow("Must input item name to add new item.");
            return;
        }
        if (newItemType.equals("")){
            loadErrorWindow("Must input item type to add new item.");
            return;
        }
        if (newPrice < 0){
            loadErrorWindow("Must input a non-negative double for price to add new item.");
            return;
        }
        if (newIngredientMap.size() == 0){
            loadErrorWindow("Must add at least one ingredient to add new item");
            return;
        }
        addNewItemToMenu(newItemName, newItemType, newPrice, newIngredientMap);
    }

    /**
     * [addNewItemToMenu adds Item add menu item to the menu_items table as well as create a MenuItem,
     * and in order to add a New menu item we need to know the name, type, and the price of the item]
     *
     * @param itemName      [Passing in the new itemName that needs to be added to
     *                      the Menu, as type String]
     * @param itemType      [Passing in the type of the new item which is of type
     *                      String]
     * @param price         [Passing in the price of the new item as type double]
     * @param ingredientMap [Since we also need to update the ingredient map as we
     *                      add a new item, passing in the ingredientMap hashmap]
     */
    public void addNewItemToMenu(String itemName, String itemType, Double price,
            HashMap<String, Double> ingredientMap) {
        // add to menuitems DB
        itemName = "'" + itemName + "'";
        itemType = "'" + itemType + "'";

        String insertMenuItems = "INSERT into menu_items (itemname,itemprice,itemtype) VALUES (" +
                itemName + " , " + price + " , " + itemType + ");";

        try {
            // opening connection
            Connection conn = dbConnection.openConn();
            Statement stmt = conn.createStatement();
            stmt.addBatch(insertMenuItems);

            // generating query
            String insertString = "INSERT INTO ingredient_map(itemname,";
            String valueString = "VALUES (" + itemName + ",";
            for (int i = 0; i < Ingredients.size(); i++) {
                String ingred = Ingredients.get(i).ingredient;
                insertString += ingred;

                // add values to valueString
                if (ingredientMap.containsKey(ingred)) {
                    valueString += ingredientMap.get(ingred);
                } else {
                    valueString += "0.0";
                }

                //adding commas
                if (i != Ingredients.size() - 1) { // don't add comma to last
                    insertString += ",";
                    valueString += ",";
                }
            }
            insertString += ") ";
            valueString += ");";
            String query = insertString + valueString;

            stmt.addBatch(query);
            stmt.executeBatch();

            dbConnection.closeConn(conn);


        } catch (Exception e) {
            System.out.println("failed to add item for item " + itemName);
        }
    }

    /**
     * [editPrice Change menu item price, if it was set to one value, change it
     * where ever it applies]
     *
     * @param item      [Passing in item of type MenuItem]
     * @param itemPrice [new price of the item]
     */
    public void editPrice(MenuItem item, Double itemPrice) throws SQLException {
        if (itemPrice < 0) {
            loadErrorWindow("Cannot change price of " + item.itemName + " to a negative number. Try again.");
            return;
        }
        String itemName = item.getItemName();
        Connection conn = dbConnection.openConn();
        Statement stmt = conn.createStatement();
        String sqlStr = "UPDATE menu_items SET itemprice = " + itemPrice + " WHERE "
                + "itemname = " + "'" + itemName + "';";

        // System.out.println(sqlStr);

        try {
            stmt.addBatch(sqlStr);
            stmt.executeBatch();
            dbConnection.closeConn(conn);
        } catch (Exception e) {
            System.out.println("failed to edit price for item " + itemName);
        }
    }

    /**
     * [addComboItem adds a combo item to the order by adding either fries or tater tots]
     * @param  m                          [m is the parameter of type 'MenuItem' that is passed that indicates the specific menu item
     *                                     that needs the combo to be added]
     */
    public void addComboItem(MenuItem m) throws SQLException {
        // Create a new menuitem and add to the order
        MenuItem comboItem = m;
        comboItem.setCurrPrice(Proj2HelperClass.COMBO_ITEM_PRICE);
        // add menu item to the order
        addMenuItem(comboItem);
    }

    /**
     * [loadCustomizeWindow launches the customize window]
     * @param menuItem  [parameter menuItem of type MenuItem that will be passed to show the specfic
     *                    menu item to bring up the customize window for]
     */
    public void loadCustomizeWindow(MenuItem menuItem) {
      customizeWindow customWindow = new customizeWindow(this,menuItem);
      customWindow.f.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
      customWindow.f.setVisible(true);
    }

    /**
     * [loadInventoryWindow launches the Inventory window]
     */
    public void loadInventoryWindow() {
      InventoryTable it = new InventoryTable(this);
      it.f.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
      it.f.setVisible(true);
    }


    /**
     * [loadErrorWindow loads the error window]
     * @param errorMsg  [parameter errorMsg of type String passed into the function that has the
     *                   specific error message to print]
     */
    public void loadErrorWindow(String errorMsg) {
        ErrorWindow w = new ErrorWindow(errorMsg);
        w.f.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        w.f.setVisible(true);
    }


    /**
     * [loadCurrSummaryWindow Shows current order summary before order is placed.]
     */
    public void loadCurrSummaryWindow() {
        if (currOrder.isEmpty()) {
            loadErrorWindow("No items have been added to order yet. Add items to see the order summary.");
            return;
        }

        Double totalPrice = 0.0;
        ArrayList<String> summaryStrings = new ArrayList<String>();
        for (int i = 0; i < currOrder.size(); i++) {
            String name = currOrder.get(i).itemName;
            Double price = currOrder.get(i).getCurrPrice();
            summaryStrings.add(name + "           $" + price.toString());
            totalPrice += price;
        }
        summaryStrings.add("Current Total Price:  $" + totalPrice.toString());
        summaryWindow w = new summaryWindow(summaryStrings);
        w.f.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        w.f.setVisible(true);
    }

    /**
     * [loadSummaryWindow loads the summary of a specfic order placed. Loads when order is placed. Shows the total and order]
     * @param orderID  [parameter orderID of type Integer which represents the orderID]
     */
    public void loadSummaryWindow(Integer orderID) {

        Double totalPrice = 0.0;
        ArrayList<String> summaryStrings = new ArrayList<String>();
        summaryStrings.add("Order ID: " + orderID.toString());
        for (int i = 0; i < currOrder.size(); i++) {
            String name = currOrder.get(i).itemName;
            Double price = currOrder.get(i).getCurrPrice();
            summaryStrings.add(name + "           $" + price.toString());
            totalPrice += price;
        }
        totalPrice = Math.round(totalPrice * 100.0) / 100.0;

        summaryStrings.add("Total Price:  $" + totalPrice.toString());
        summaryStrings.add("Order ID: " + orderID + " has been placed!");

        summaryWindow w = new summaryWindow(summaryStrings);
        w.f.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        w.f.setVisible(true);
    }

    /**
     * [itemInStock checks an items to see if the items ingredients are in stock]
     * @param  item                       [MenuItem 'item' passed to check whether that specific item has ingredients in stock]
     * @return              [returns true if the ingredients for that MenuItem 'item' is in stock, else return false if not]
     */
    public Boolean itemInStock(MenuItem item) throws SQLException {
        for (Map.Entry<String, Double> set : item.ingredients.entrySet()) {
            // if that ingredient is in this item, check if there's enough
            if (set.getValue() != 0) {
                Boolean inStock = ingredientInStock(set.getKey(), set.getValue());
                if (!inStock) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * [Returns based on if DB inventory has numRequired ingredients left. If in stock, return true. ]
     * @param numRequired [number of ingredients checked]
     */
    public Boolean ingredientInStock(String ingredient, Double numRequired) throws SQLException {
        String q = "SELECT ingredientremaining FROM inventory WHERE ingredient = '" + ingredient + "';";
        ResultSet result = dbConnection.oneLinerQuery(q);
        Integer numLeft = -1;
        while (result.next()) {
            numLeft = result.getInt("ingredientremaining");
        }

        if (numLeft < numRequired) {
            return false;
        }
        return true;
    }

    /**
     * [This is for the CUSTOMIZE_WINDOW, not ORDER_WINDOW. Adds to the ingredients hashmap of the menuitem one item at a time.]
     * @param ingredient [Ingedient to add on to menu item]
     * @param item [Menu Item being cuztomized]
     */
    public void addOn(String ingredient, MenuItem item) throws SQLException {
        if (!ingredientInStock(ingredient, 1.0)) {
            loadErrorWindow(ingredient + " is not in stock.");
            return;
        }
        HashMap<String, Double> map = item.ingredients;
        if (map.containsKey(ingredient)) {
            // get the current value and increment it
            Double currVal = item.ingredients.get(ingredient);
            // update the increased value back in the map
            map.put(ingredient, currVal + 1);
        }
        // if not in the map, add it to the map
        else {
            map.put(ingredient, 1.0);
        }
    }

    /**
     * This is for the CUSTOMIZE_WINDOW, not ORDER_WINDOW. Adds to the
     * ingredients hashmap of the menuitem one item at a time.
     * @param ingredient [The ingredient to delete.]
     */
    public void subtractOff(String ingredient, MenuItem item) {
        HashMap<String, Double> map = item.ingredients;

        // if this ingredient isn't one of the existing ingredients or hasn't been added
        // on, return
        if (!map.containsKey(ingredient)) {
            return;
        }

        Double currVal = item.ingredients.get(ingredient);

        // if the ingredients are already 0 or negative (should never be negative, so
        // that's a bigger issue), return
        if (currVal <= 0) {
            loadErrorWindow("There are no more" + ingredient + "s to remove.");
            return;
        }

        // update the decreased value back in the map
        map.put(ingredient, currVal - 1);
    }

    /**
     * [addMenuItem adds a MenuItem to the ArrayList currOrder]
     * @param  m                          [the MenuItem passed to add to currOrder]
     */
    public void addMenuItem(MenuItem m) throws SQLException {
        // if item's ingredients are not in stock, return.
        if (!itemInStock(m)) {
            loadErrorWindow(m.itemName + " is not in stock.");
            return;
        }

        currOrder.add(m);
        currOrderNames.add(m.getItemName());
    }

    /**
     * [deleteMenuItem deletes a MenuItem from the currOrderNames ArrayList as well as the currOrder ArrayList]
     * @param m  [the MenuItem passed to delete from both ArrayList's currOrderNames and currOrder]
     */
    public void deleteMenuItem(MenuItem m) {
        // if no items ordered, then return
        if (currOrder.size() == 0) {
            loadErrorWindow("You cannot delete an item off an empty order.");
            return;
        }

        if (!currOrder.contains(m)) {
            loadErrorWindow("This order doesn't contain " + m.itemName);
            return;
        }
        // if specified item not actually added to order, return
        if (!currOrderNames.contains(m.getItemName())) {
            return;
        }

        // finds index of most recent menuitem ordered
        int deleteIndex = currOrderNames.lastIndexOf(m.getItemName());
        currOrderNames.remove(deleteIndex);
        currOrder.remove(deleteIndex);
    }

    /**
     * [placeOrder places an order using the most reecent orderID]
     * @return [returns an ArrayList of everything that was placed in the order along with the orderID]
     */
    public ArrayList<Object> placeOrder() throws SQLException {
        // a cuztomized item changes that menu item object's map in java
        if (currOrder.size() == 0) {
            loadErrorWindow("No items are in the current order, so cannot place order");
            return new ArrayList<Object>();
        }

        // get most highest/recent orderID
        String prevOrderID = "SELECT MAX(orderid) as max_orderids FROM order_totals;";
        ResultSet orderID_RS = dbConnection.oneLinerQuery(prevOrderID);
        int orderid = -1;
        try {
            while (orderID_RS.next()) {
                int pOrderID = orderID_RS.getInt("max_orderids");
                orderid = pOrderID + 1; // set current orderID
                // System.out.println(orderid); //FLAG: comment out

            }
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println(e.getClass().getName() + ": " + e.getMessage());
            System.err.println("Error in placeOrder()");
            System.exit(0);
        }

        // create lineitem
        int lineitem = 0;

        // create connection for sending
        Connection orderHistory_conn = dbConnection.openConn();
        Statement orderStmt = orderHistory_conn.createStatement(); // batched order history update
        Statement inventoryStmt = orderHistory_conn.createStatement(); // batched inventory update
        Statement totalStmt = orderHistory_conn.createStatement(); // order_totals update

        Double totalprice = 0.0;

        // loop through currItems
        for (MenuItem item : currOrder) {
            // update order history
            // increment lineitem
            lineitem++;

            // get name
            String itemname = "'" + item.getItemName() + "'";

            // get price
            double itemprice = item.getCurrPrice();


            // orderpk
            String orderpk = "'" + orderid + "_" + lineitem + "'";

            // get date
            String date = LocalDate.now().toString(); // year-month-day
            String[] dateArr = date.split("-");
            Integer orderyear = Integer.parseInt(dateArr[0]);
            Integer ordermonth = Integer.parseInt(dateArr[1]);
            Integer orderday = Integer.parseInt(dateArr[2]);

            // batch query
            String insertInto = "INSERT INTO order_history(orderpk, orderid, lineitem, itemname, itemprice, isgameday, orderday, ordermonth, orderyear) ";
            String values = "VALUES(" + orderpk + "," + orderid + "," + lineitem + "," + itemname + "," + itemprice +
                    "," + isGameDay + "," + orderday + "," + ordermonth + "," + orderyear + ")";
            String insertCMD = insertInto + values;
            orderStmt.addBatch(insertCMD);

            // update inventory
            // loop through hashmap
            for (Map.Entry<String, Double> set : item.ingredients.entrySet()) {

                // if that ingredient is in this item, update
                if (set.getValue() != 0) {
                    String updateUsed = "update inventory set amountused=amountused+" + set.getValue()
                            + " where ingredient='" + set.getKey() + "';";
                    String updateRemaining = "update inventory set ingredientremaining=ingredientremaining-"
                            + set.getValue() + " where ingredient='" + set.getKey() + "';";

                    inventoryStmt.addBatch(updateUsed);
                    inventoryStmt.addBatch(updateRemaining);
                }
            }

            // sum currPrice of each item
            totalprice += item.getCurrPrice();
            // rounding to 2 decimal places
            totalprice = Math.round(totalprice * 100.0) / 100.0;
        }

        // update order totals
        String totalQuery = "INSERT INTO order_totals(orderid,totalprice) VALUES (" + orderid + "," + totalprice + ");";
        orderStmt.addBatch(totalQuery);

        // send batched queries to: order_totals, order_history, inventory tbls
        orderStmt.executeBatch();
        inventoryStmt.executeBatch();
        orderHistory_conn.close();

        // store currOrder and id to delete in deletePrevOrder()
        ArrayList<Object> retVal = new ArrayList<Object>();
        retVal.add(currOrder);
        retVal.add(orderid);

        // load summary window
        loadSummaryWindow(orderid);

        // reset currOrder and currOrderNames for next order
        ArrayList<MenuItem> currOrder_new = new ArrayList<MenuItem>();
        ArrayList<String> currOrderNames_new = new ArrayList<String>();
        currOrder = currOrder_new;
        currOrderNames = currOrderNames_new;

        return retVal;

    }

    /**
     * [updateAddOns updates the add ons in the database]
     * @param  ingredient                 [the ingredient of type String to be added on]
     */
    public void updateAddOns(String ingredient) throws SQLException {
        LocalDate today = LocalDate.now();
        String date = today.format(DateTimeFormatter.ofLocalizedDate(FormatStyle.SHORT));

        // if day already exists, which it should since inventory_history updates as
        // soon as the window is opened that day
        String q = "select * from addons_history where date= '" + date + "';";
        ResultSet rs = dbConnection.oneLinerQuery(q);
        if (!rs.next()) { // date not yet populated in table
            return;
        }
        Connection conn = dbConnection.openConn();
        Statement stmt = conn.createStatement();
        String updateUsed = "update addons_history set " + ingredient + "=" + ingredient + "+" + 1 + " where date='"
                + date
                + "';";
        stmt.addBatch(updateUsed);
        stmt.executeBatch();
        dbConnection.closeConn(conn);
    }

    /**
     * [deletePrevOrder deletes previous order from the inventory and also updates the ingredients. Can only delete one]
     * @param  orderPlaced                [ArrayList of all the orders that have been placed]
     */
    public void deletePrevOrder(ArrayList<Object> orderPlaced) throws SQLException {
        @SuppressWarnings("unchecked")
        ArrayList<MenuItem> prevOrder = (ArrayList<MenuItem>) orderPlaced.get(0);
        Integer prevOrderID_int = (Integer) orderPlaced.get(1);

        Connection conn = dbConnection.openConn();
        Statement stmt = conn.createStatement(); // batched order history update

        // delete from inventory
        for (MenuItem item : prevOrder) {
            for (Map.Entry<String, Double> set : item.ingredients.entrySet()) {
                // if that ingredient is in this item, update
                if (set.getValue() != 0) {
                    String updateUsed = "update inventory set amountused=amountused-" + set.getValue()
                            + " where ingredient='" + set.getKey() + "';";
                    String updateRemaining = "update inventory set ingredientremaining=ingredientremaining+"
                            + set.getValue() + " where ingredient='" + set.getKey() + "';";

                    stmt.addBatch(updateUsed);
                    stmt.addBatch(updateRemaining);
                }
            }
        }

        // delete from order_history
        String deleteHistory = "DELETE FROM order_history WHERE orderid=" + prevOrderID_int + ";";
        stmt.addBatch(deleteHistory);

        // delete from order_totals
        String deleteTotals = "DELETE FROM order_totals WHERE orderid=" + prevOrderID_int + ";";
        stmt.addBatch(deleteTotals);

        stmt.executeBatch();
        conn.close();

    }

    /**
     * [getRestockReportData gets the ingredients that needs to be restocked at the time the restock report buttom is clicked]
     * @return [returns an ArrayList of Strings that holds the ingredients that need to be restocked]
     */

    public ArrayList<String> getRestockReportData() throws SQLException {
        HashMap<String, Double> itemsToRestockMap = new HashMap<String, Double>();
        ArrayList<String> itemsToRestock = new ArrayList<String>();
        String menuTableQuery = "select * from inventory;";

        ResultSet rs = dbConnection.oneLinerQuery(menuTableQuery);

        while (rs.next()) {
            String ingredient    = rs.getString("ingredient");
            Double ingredientremaining = rs.getDouble("ingredientremaining");
            Double minimumamount = rs.getDouble("minimumamount");

            if(ingredientremaining < minimumamount)
               itemsToRestockMap.put(ingredient,minimumamount);
        }
        for (Map.Entry<String, Double> set : itemsToRestockMap.entrySet()) {
            itemsToRestock.add(set.getKey());
        }

        return itemsToRestock;
    }

    /**
     * [getAddOnsReport gets the add ons report for the customized order between 2 specific dates given the the dates]
     * @param  startDay                   [day in the start date of type int]
     * @param  startMonth                 [month in the start date of type int]
     * @param  startYear                  [year in the start date of type int]
     * @param  endDay                     [day in the end date of type int]
     * @param  endMonth                   [month in the end date of type int]
     * @param  endYear                    [year in the end date of type int]
     * @return              [returns an ArrayList of add ons for the customized order along with the amount added on, in each entry]
     */
    public ArrayList<String> getAddOnsReport(int startDay, int startMonth, int startYear, int endDay, int endMonth,
            int endYear)
            throws SQLException {
        // getting list of dates
        LocalDate startDate = LocalDate.of(startYear, startMonth, startDay);
        LocalDate endDate = LocalDate.of(endYear, endMonth, endDay);

        long numOfDays = ChronoUnit.DAYS.between(startDate, endDate);

        java.util.List<LocalDate> listOfDates = Stream.iterate(startDate, date -> date.plusDays(1)) // source:
                                                                                                    // https://howtodoinjava.com/java/date-time/java-time-localdate-class/#2-creating-instance-of-localdate
                .limit(numOfDays)
                .collect(Collectors.toList());

        ArrayList<String> formattedDates = new ArrayList<String>();
        for (int i = 0; i < listOfDates.size(); i++) {
            String formatted = listOfDates.get(i).format(DateTimeFormatter.ofLocalizedDate(FormatStyle.SHORT));
            formattedDates.add(formatted);
        }

        // query rows from AddOns_History that are between the above dates
        String query = "select * from AddOns_History;";
        ResultSet rs = dbConnection.oneLinerQuery(query);

        // create hashmap<ingredient, double>
        HashMap<String, Double> addons = new HashMap<String, Double>();

        // loop through the resultset rows
        ResultSetMetaData md = rs.getMetaData();

        int rowNum = 0;
        while (rs.next()) {
            // loop through result set columns, update hashmap
            if (!formattedDates.contains(rs.getString("date"))) {
                continue;
            }
            rowNum++;
            for (int i = 2; i < md.getColumnCount() + 1; i++) {
                String quantity = rs.getString(i);
                if (rowNum == 1) { // first time entering
                    addons.put(md.getColumnName(i), Double.parseDouble(quantity));
                } else {
                    addons.put(md.getColumnName(i),
                            (Double) (addons.get(md.getColumnName(i)) + Double.parseDouble(quantity)));
                }
            }
        }

        // formatting addons to be displayed
        ArrayList<String> addonStrings = new ArrayList<String>();
        addonStrings.add("This report shows the quantity of ingredients added on to customized orders between "
                + startDate.toString() + " and " + endDate.toString());
        addonStrings.add("   ");
        addonStrings.add("Add Ons added to Customized Order             Amount Added On");
        for (Map.Entry<String, Double> set : addons.entrySet()) {
            String addon = set.getKey();
            String amount = set.getValue().toString();
            addonStrings.add(addon + "             " + amount);
        }

        return addonStrings;

    }

    /**
     * [loadAddOnsReport loads the add ons to the GUI during certain dates]
     * @param  dates                      [String that is in the form "MM/DD/YY - MM/DD/YY"]
     */
    public void loadAddOnsReport(String dates) throws SQLException {
        // parse dates in following format: "10/10/22 - 10/18/22"
        if (dates == null){
            return;
        }
        dates = dates.replaceAll(" ", ""); // stripping whitespace
        String[] arrOfStr = dates.split("-");
        String start = arrOfStr[0];
        String end = arrOfStr[1];
        String[] startArr = start.split("/");
        String[] endArr = end.split("/");
        int startMonth = Integer.parseInt(startArr[0]);
        int startDay = Integer.parseInt(startArr[1]);
        int startYear = Integer.parseInt(startArr[2]);
        int endMonth = Integer.parseInt(endArr[0]);
        int endDay = Integer.parseInt(endArr[1]);
        int endYear = Integer.parseInt(endArr[2]);

        ArrayList<String> display = getAddOnsReport(startDay, startMonth, startYear, endDay, endMonth, endYear);
        summaryWindow w = new summaryWindow(display);
        w.f.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        w.f.setVisible(true);
    }

    /**
     * [getCurrOrder gets the current instance of ArrayList currorder]
     * @return [returns the arrayList of current order items in an ArrayList]
     */
     public ArrayList<MenuItem> getCurrOrder() {
         return currOrder;
     }

    /**
     * [setCurrOrder sets the current instance of ArrayList currOrder to the class variable currOrder
     *               to track the items on the current order]
     * @param currOrder  [an ArrayList that stores multiple menu items of type MenuItem]
     */
    public void setCurrOrder(ArrayList<MenuItem> currOrder) {
         this.currOrder = currOrder;
     }

    /**
     * [getCurrOrderNames gets the current instance of ArrayList currOrderNames]
     * @return [returns the ArrayList of current order name]
     */
    public ArrayList<String> getCurrOrderNames() {
         return currOrderNames;
     }

    /**
     * [setCurrOrderNames sets the current instance of ArrayList currOrderNames to the current order names passed]
     * @param currOrderNames  [an ArrayList of currOrderNames each of type String]
     */
     public void setCurrOrderNames(ArrayList<String> currOrderNames) {
         this.currOrderNames = currOrderNames;
     }


    /**
     * Calculates excess by looking for increasing inventory
     * <p>
     * This method has a return a vector of menu items in excess
     * @param o object that allows you to access all of the methods to manipulate the inventory
     * @param m object that allows you to access all of the methods within MenuItem.java
     * @param startDate start date from user
     * @param endDate end date from user
     * @param panel display panel for excess items
     * @param f current frame
     */
    public List<String> calculateExcess(OrderWindow o, MenuItem m, String startDate, String endDate, Panel panel, JFrame f) throws SQLException {
        // String startDate = "9/3/22";
        // String endDate = "9/6/22";

        String timeRangeQueryStart = "SELECT * FROM inventory_history WHERE date = '" + startDate + "';";
        String timeRangeQueryEnd = "SELECT * FROM inventory_history WHERE date = '" + endDate + "';";

        ResultSet rsStart = dbConnection.oneLinerQuery(timeRangeQueryStart);
        ResultSet rsEnd = dbConnection.oneLinerQuery(timeRangeQueryEnd);

        HashMap<String, Integer> inventoryAtStart = new HashMap<String, Integer>();
        Vector<Integer> inventoryAtEnd = new Vector<Integer>();


        ResultSetMetaData excessMDStart = rsStart.getMetaData();
        while (rsStart.next()) {
            for (int i = 2; i < excessMDStart.getColumnCount() + 1; i++) {
                String col = excessMDStart.getColumnName(i);
                Integer amount = rsStart.getInt(i);
                inventoryAtStart.put(col, amount);
            }
        }

        ResultSetMetaData excessMDEnd = rsEnd.getMetaData();
        while (rsEnd.next()) {
            for (int i = 2; i < excessMDEnd.getColumnCount() + 1; i++) {
                Integer amount1 = rsEnd.getInt(i);
                inventoryAtEnd.add(amount1);
            }
        }

        Vector<String> itemExcess = new Vector<String>();

        int i = 0;
        for (Map.Entry<String,Integer> entry :inventoryAtStart.entrySet()) {
            if (inventoryAtEnd.get(i) > (.9 * entry.getValue())) {
                itemExcess.add(entry.getKey());
            }
            i++;
        }

        rsStart.close();
        return itemExcess;
    }

    /**
     * [calculateSales calculates the sales report needed over a specific time period given a start and end data]
     * @param  o                          [OrderWindow]
     * @param  m                          [MenuItem]
     * @param  startDate                  [String start date in the form of dd/mm/yy]
     * @param  endDate                    [String end date in the form of dd/mm/yy]
     * @param  panel                      [Panel]
     * @param  f                          [JFrame]
     * @return              [returns the HashMap<String, Integer> itemSales that holds the itemName and number of sales]
     */
    public HashMap<String, Integer> calculateSales(OrderWindow o, MenuItem m, String startDate, String endDate, Panel panel, JFrame f) throws SQLException {
        String[] startDateSplit = startDate.split("/");
        String startDay = startDateSplit[0];
        String startMonth = startDateSplit[1];
        String[] endDateSplit = endDate.split("/");
        String endDay = endDateSplit[0];
        String endMonth = endDateSplit[1];

        String query = "SELECT * FROM order_history WHERE orderday >= '"
            + startDay + "' AND ordermonth >= '" + startMonth + "' AND orderday <= '"
            + endDay + "' AND ordermonth <= '" + endMonth + "';";

        ResultSet rs = dbConnection.oneLinerQuery(query);

        HashMap<String, Integer> itemSales = new HashMap<String, Integer>();

        while (rs.next()) {
            String itemName = rs.getString("itemname");
            if (itemSales.containsKey(itemName)) {
                itemSales.put(itemName, itemSales.get(itemName) + 1);
            } else {
                itemSales.put(itemName, 1);
            }
        }

        rs.close();
        return itemSales;
    }

}
