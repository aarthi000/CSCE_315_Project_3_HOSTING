import java.awt.event.ActionListener;
import javax.swing.event.*;
import java.awt.event.*;
import javax.swing.*;
import java.sql.*;

import java.util.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.io.*;


/**
 * This class contains the action listener for the Customize Window buttons.
 */
public class customizeWindowActionListener implements ActionListener {
    OrderWindow o;
    MenuItem m;
    String ingred;

    /**
     * [customizeWindowActionListener Action listener for customizeWindow]
     * @param order  [OrderWindow that contains the menuItem]
     * @param item   [MenuItem for which customer is adding customization]
     */
    public customizeWindowActionListener(OrderWindow order, MenuItem item) {
        o = order;
        m = item;
    }

    /**
     * [customizeWindowActionListener Action listener for customizeWindow]
     * @param order  [OrderWindow that contains the menuItem]
     * @param item   [MenuItem for which customer is adding customization]
     * @param ingredient  [String ingredient in the MenuItem]
     */
    public customizeWindowActionListener(OrderWindow order, MenuItem item, String ingredient) {
        o = order;
        m = item;
        ingred = ingredient;
    }

    /**
     * [actionPerformed action perform method called when action is triggered depending on button pressed.]
     * @param e  [ActionEvent e]
     */
    public void actionPerformed(ActionEvent e) {

        /* Customize Window Action Listeners */
        // - button
        if (((JButton) e.getSource()).getText().equals("-")) {
            o.subtractOff(ingred, m);
            // System.out.println(m.ingredients);
        }

        // + button
        if (((JButton) e.getSource()).getText().equals("+")) {
            try {
                o.addOn(ingred, m);
                o.updateAddOns(ingred);
            } catch (Exception error) {
                error.printStackTrace();
                System.err.println(error.getClass().getName() + ": " + error.getMessage());
                System.exit(0);
            }
        }
        // Add Customized Order
        if (((JButton) e.getSource()).getText().equals("Add Customized Item"))

        {
            try {
                o.addMenuItem(m);
            } catch (Exception error) {
                // TODO: handle exception
                error.printStackTrace();
                System.err.println(error.getClass().getName() + ": " + error.getMessage());
                System.exit(0);
            }
        }

        // Delete last order only if an order was already placed in customized window
        if (((JButton) e.getSource()).getText().equals("Delete Last Item")) {
            try {
                o.deleteMenuItem(m);
            } catch (Exception error) {
                // Handles exception
                error.printStackTrace();
                System.err.println(error.getClass().getName() + ": " + error.getMessage());
                System.exit(0);
            }
        }

        // Add Combo
        if (((JButton) e.getSource()).getText().equals("Make Combo")) {
           try {
           o.addComboItem(m);

            } catch (Exception error) {
                error.printStackTrace();
                System.err.println(error.getClass().getName() + ": " + error.getMessage());
                System.exit(0);
            }
        }

    }

}
