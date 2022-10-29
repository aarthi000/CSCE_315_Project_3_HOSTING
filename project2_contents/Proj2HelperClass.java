import java.util.ArrayList;
import java.sql.*;

/**
 * This class contains helper functions and members that help the OrderWindow class.
 */
public class Proj2HelperClass {
    public static boolean isGameDayVal = false;

    public static final String INSERT_INVENTORY = "INSERT INTO inventory (ingredient, ingredientremaining, amountused) VALUES (";
    public static final String UPDATE_ORDERHIST = "UPDATE order_history SET ";
    public static final String INGREDIENTMAP_TABLE = "ingredientmap";
    public static final String ITEMNAME   = "itemname";
    public static final String BURGERS    = "burger";
    public static final String SIDES      = "side";
    public static final String SANDWICHES = "sandwich";
    public static final String SALADS     = "salad";
    public static final String DESSERTS    = "dessert";
    public static final String DRINKS     = "drink";

    public static final Double COMBO_ITEM_PRICE      = 1.89;

    public static final String INGREDIENT_TABLE      = "ingredient";
    public static final String INGREDIENT_REMAINING  = "ingredientremaining";
    public static final String INGREDIENT_AMOUNTUSED = "amountused";

    /**
     * [getListFromResultSet creates and ArrayList from the ResultSet returned by the DB query]
     * @param  set               [ResultSet set]
     * @return     [returns an ArrayList of strings]
     */
    public static ArrayList<String> getListFromResultSet(ResultSet set) {
        try {
           ArrayList<String> aList = new ArrayList<String>();
           while(set.next()) {
               aList.add(set.getString(0));
           }
           return aList;
        }
        catch (Exception e) {
             System.out.println("Cannot convert Result set to array list");
        }
        return null;
    }

    /**
     * [isGameDay returns true if it is a gameDay]
     * @return [returns true or false]
     */
    public static boolean isGameDay() {
        // returns true if it is game day else false
        // return isGameDay from a helper class which has instance method isGameDay
        return isGameDayVal;
    }

    /**
     * [toggleGameDay toggles the game day value]
     */
    public static void toggleGameDay() {
        // is the game day varialbe = toggle
        isGameDayVal = !isGameDayVal;
    }

}
