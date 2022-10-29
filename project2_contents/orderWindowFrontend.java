import javax.print.attribute.standard.PrinterIsAcceptingJobs;
import javax.swing.*;
import javax.swing.border.Border;
import java.awt.*;
import java.util.*;

import java.awt.event.*;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
/**
 * This class contains the frontend functionality for the main order window of the GUI. 
 */
public class orderWindowFrontend {
    static JFrame frame;
    static JComboBox<String> cBox;
    JLabel label;

    /**
     * Creates the window that allows server to make orders and allows manager to get to inventory page and add menu items
     * <p>
     * This method does not have a return value, but it does create the design for the order window page.
     * This includes creating buttons and calling the action listener to setup for a specific action.
     * @param o object that allows you to access all of the methods to manipulate the order window page
     */
    public orderWindowFrontend(OrderWindow o) {
        frame = new JFrame("Order");
        label = new JLabel("Order");

        // initialize frame properties
        frame.setSize(800, 800);
        frame.setLayout(new BorderLayout());
        frame.getContentPane().setBackground(new Color(90, 6, 25));

        // add title
        JLabel title = new JLabel("Order");
        title.setFont(new Font(null, Font.PLAIN, 35));
        title.setForeground(Color.WHITE);
        title.setHorizontalAlignment(JLabel.CENTER);
        frame.add(title, BorderLayout.NORTH);

        // create panel properties
        Dimension panelSize = new Dimension(400, 3000);
        Color panelColor = new Color(255, 241, 241);
        Font textFont = new Font(null, Font.PLAIN, 25);
        Color textColor = Color.BLACK;
        FlowLayout panelLayout = new FlowLayout(FlowLayout.CENTER, 10, 12);

        // create panel for menu items
        JPanel orderPanel = new JPanel();
        orderPanel.setLayout(panelLayout);
        orderPanel.setPreferredSize(panelSize);
        orderPanel.setBackground(panelColor);

        // create panel for adding new menu item
        JPanel newItemPanel = new JPanel();
        newItemPanel.setLayout(panelLayout);
        newItemPanel.setPreferredSize(panelSize);
        newItemPanel.setBackground(panelColor);
        frame.add(newItemPanel);

        // adding scrolling feature
        JScrollPane orderSP = new JScrollPane(orderPanel);
        orderSP.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
        orderSP.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_ALWAYS);
        frame.add(orderSP, BorderLayout.EAST);

        JScrollPane addSP = new JScrollPane(orderPanel);
        addSP.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
        addSP.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_ALWAYS);
        frame.add(addSP, BorderLayout.WEST);

        // create and add menu items title
        JLabel menuItemsLabel = new JLabel("Menu Items");
        menuItemsLabel.setFont(textFont);
        menuItemsLabel.setForeground(textColor);
        orderPanel.add(menuItemsLabel);
        orderPanel.add(Box.createRigidArea(new Dimension(300, 0)));

        // create and add new menu items title
        JLabel newItemTitleLabel = new JLabel("Creating New Menu Item");
        newItemTitleLabel.setFont(textFont);
        newItemTitleLabel.setForeground(textColor);
        newItemPanel.add(newItemTitleLabel);
        newItemPanel.add(Box.createRigidArea(new Dimension(300, 0)));

        // create and add buttons for new menu item panel

        // combobox of ingredients
        ArrayList<String> inven = o.AddOnsForGUI;
        String[] invenList = new String[inven.size()];
        for (int i = 0; i < inven.size(); i++) {
            invenList[i] = inven.get(i);
        }
        cBox = new JComboBox<>(invenList);
        cBox.setBounds(60, 32, 200, 50);
        newItemPanel.add(cBox);

        // buttons
        JButton addIngredient = new JButton("Add the Selected Ingredient");
        addIngredient.addActionListener(new OrderWindowActionListener(o, cBox));
        JButton addPrice = new JButton("Input Price of New Menu Item");
        addPrice.addActionListener(new OrderWindowActionListener(o, cBox));
        JButton nameNewMenuItem = new JButton("Name New Menu Item");
        nameNewMenuItem.addActionListener(new OrderWindowActionListener(o, cBox));
        JButton addNewType = new JButton("Add Type of New Menu Item");
        addNewType.addActionListener(new OrderWindowActionListener(o, cBox));
        JButton addNewMenuItem = new JButton("Add New Menu Item");
        addNewMenuItem.addActionListener(new OrderWindowActionListener(o, cBox));

        newItemPanel.add(addIngredient);
        newItemPanel.add(addPrice);
        newItemPanel.add(nameNewMenuItem);
        newItemPanel.add(addNewType);
        newItemPanel.add(addNewMenuItem);


        // FLAG : UNCOMMENT ME
        int numMenuItems = o.MenuItemsForGUI.size();
        String menuItem = "HELLO";
        double itemPrice = 0;
        MenuItem m;

        for (int i = 0; i < numMenuItems; i++) {
            m = o.MenuItemsForGUI.get(i);
            menuItem = m.itemName;
            itemPrice = m.currPrice;
            JLabel item = new JLabel(menuItem);
            JLabel pri = new JLabel(Double.toString(itemPrice));
            item.setFont(new Font(null, Font.PLAIN, 20));
            item.setForeground(textColor);

            JButton customizeButton = new JButton("Customize");
            JButton addButton = new JButton("+");
            JButton subButton = new JButton("-");
            JButton priceButton = new JButton("Edit Price");
            customizeButton.addActionListener(new OrderWindowActionListener(o, m));
            addButton.addActionListener(new OrderWindowActionListener(o, m)); //
            subButton.addActionListener(new OrderWindowActionListener(o, m)); //

            priceButton.addActionListener(new OrderWindowActionListener(o, m, pri, frame)); //
            orderPanel.add(item);
            orderPanel.add(pri);
            orderPanel.add(customizeButton);
            orderPanel.add(addButton);
            orderPanel.add(subButton);
            orderPanel.add(priceButton);
            priceButton.addActionListener(new OrderWindowActionListener(o, m));
            orderPanel.add(Box.createRigidArea(new Dimension(200, 0)));
        }

        // get these from database
        JPanel buttonPanel = new JPanel();
        JButton gameDay = new JButton("Game Day");
        JButton order = new JButton("Place Order");
        JButton removeLastOrder = new JButton("Remove Last Order");
        JButton inventoryButton = new JButton("Inventory");
        JButton orderSummary = new JButton("Order Summary");
        JButton addMenuItem = new JButton("Add Menu Item");
        buttonPanel.add(gameDay);
        buttonPanel.add(order);
        buttonPanel.add(inventoryButton);
        buttonPanel.add(removeLastOrder);
        buttonPanel.add(orderSummary);
        buttonPanel.add(addMenuItem);

        addMenuItem.addActionListener(new OrderWindowActionListener(o));
        inventoryButton.addActionListener(new OrderWindowActionListener(o));

        ItemListener itemListener = new ItemListener() {
 
            // itemStateChanged() method is invoked automatically
            // whenever you click or unlick on the Button.
            public void itemStateChanged(ItemEvent itemEvent)
            {
 
                // event is generated in button
                int state = itemEvent.getStateChange();
 
                // if selected print selected in console
                if (state == ItemEvent.SELECTED) {
                    System.out.println("Selected");
                }
                else {
 
                    // else print deselected in console
                    System.out.println("Deselected");
                }
            }
        };        
        
        frame.add(buttonPanel, BorderLayout.SOUTH);
        gameDay.addActionListener(new OrderWindowActionListener(o)); // uncomment when ready
        order.addActionListener(new OrderWindowActionListener(o)); // uncomment when ready
        removeLastOrder.addActionListener(new OrderWindowActionListener(o)); // uncomment when ready
        orderSummary.addActionListener(new OrderWindowActionListener(o)); // uncomment when ready

        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }

    public static void main(String[] args) throws Exception {
        OrderWindow o = new OrderWindow(); // uncommment me
        new orderWindowFrontend(o); // uncommment me
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setVisible(true);
    }

}