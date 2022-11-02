/**
 * This class constructs an ingredient object, which contains its associated remaining and used quantities. 
 */
public class ingredient {
    public String ingredient;
    public Double ingredientremaining;
    public Double amountused;
    public Double minimumamount;

    /**
     * Constructor for an entry in the inventory table.
     * <p>
     * This method does not have a return value, but it does assign variables needed to make the inventory tables to the values passed in
     * @param i 
     * @param ir 
     * @param au 
     */
    public ingredient(String i, Double ir, Double au, Double mn){
        ingredient = i;
        ingredientremaining = ir;
        amountused = au;
        minimumamount = mn;
    }

    /**
     * Returns a string containing the source text segment which was defined by the function.
     * <p>
     * This method does not have a return value, but it does return a string with all of the values
     */
    @Override
    public String toString() {
        return "{" +
            " ingredient='" + ingredient + "'" +
            ", ingredientremaining='" + ingredientremaining + "'" +
            ", amountused='" + amountused + "'" +
            ", minimumamount='" + minimumamount + "'" +
            "}";
    }

    
}
