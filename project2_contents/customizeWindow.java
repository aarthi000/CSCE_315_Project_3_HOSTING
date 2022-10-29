import java.sql.*;
import java.util.*;

import java.awt.*;
import java.awt.event.ActionListener;
import javax.swing.event.*;
import java.awt.event.*;
import java.util.Map;


import javax.swing.*;
import javax.swing.border.Border;


/**
 * This class contains the frontend functionality for the Customize Window when "Customize" is pressed.
 */
public class customizeWindow {
     JFrame f;

    /**
     * [customizeWindow Customize window provides user dialog to customize the menu item and add or delete ingredients]
     * @param o  [OrderWindow o from which customizeItem is launched]
     * @param m  [MenuItem m which customization is done on]
     */
    public customizeWindow(OrderWindow o, MenuItem m) {
        // initialize frame and set properties
        f = new JFrame("Customize");
        f.setSize(650, 600);
        f.setLayout(new BorderLayout());
        f.getContentPane().setBackground(new Color(90, 6, 25));

        // add title label
        JLabel title = new JLabel("Customize");
        title.setFont(new Font(null, Font.PLAIN, 35));
        title.setForeground(Color.WHITE);
        title.setHorizontalAlignment(JLabel.CENTER);
        f.add(title, BorderLayout.NORTH);

        // create panel properties
        Dimension panelSize = new Dimension(300, 3000);
        Color panelColor = new Color(255, 241, 241);
        Font textFont = new Font(null, Font.PLAIN, 25);
        Color textColor = Color.BLACK;
        FlowLayout panelLayout = new FlowLayout(FlowLayout.CENTER, 10, 12);

        // create ingredient panel
        JPanel ingredientPanel = new JPanel();
        ingredientPanel.setLayout(panelLayout);
        ingredientPanel.setPreferredSize(panelSize);
        ingredientPanel.setBackground(panelColor);

        JScrollPane ingredientSP = new JScrollPane(ingredientPanel);
        ingredientSP.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
        ingredientSP.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED);

        // create add-ons panel
        JPanel addonsPanel = new JPanel();
        addonsPanel.setLayout(panelLayout);
        addonsPanel.setPreferredSize(panelSize);
        addonsPanel.setBackground(panelColor);

        JScrollPane addonsSP = new JScrollPane(addonsPanel);
        addonsSP.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
        addonsSP.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED);

        // create and add bottom buttons
        JPanel buttonPanel = new JPanel();
        JButton addOrderButton = new JButton("Add Customized Item");
        JButton comboButton = new JButton("Make Combo");
        JButton deleteOrderButton = new JButton("Delete Last Item");
        buttonPanel.add(addOrderButton);
        buttonPanel.add(comboButton);
        buttonPanel.add(deleteOrderButton);
        f.add(buttonPanel, BorderLayout.SOUTH);

        //action listeners for bottom buttons
        addOrderButton.addActionListener(new customizeWindowActionListener(o, m));
        comboButton.addActionListener(new customizeWindowActionListener(o, m));
        deleteOrderButton.addActionListener(new customizeWindowActionListener(o, m));


        // create and add ingredient title
        JLabel ingTitleLabel = new JLabel("Ingredients");
        ingTitleLabel.setFont(textFont);
        ingTitleLabel.setForeground(textColor);
        ingredientPanel.add(ingTitleLabel);
        ingredientPanel.add(Box.createRigidArea(new Dimension(300, 0)));
        f.add(ingredientSP, BorderLayout.WEST);

        // generate ingredient buttons
        int numIngredients = 0; // change depending on number of ingredients
        ArrayList<String> ingredients = new ArrayList<String>();
        for (Map.Entry<String, Double> set : m.ingredients.entrySet()) { ///get number of ingredients in item m
            if (set.getValue() != 0) {
                numIngredients++;
                ingredients.add(set.getKey());
            }
        }

        String ingName = "NAME"; // change depending on ingredient name
        for (int i = 0; i < numIngredients; i++) {
            ingName = ingredients.get(i);
            JLabel ingLabel = new JLabel(ingName);
            ingLabel.setFont(new Font(null, Font.PLAIN, 20));
            ingLabel.setForeground(textColor);
            JButton ingButton = new JButton("-");
            ingButton.addActionListener(new customizeWindowActionListener(o, m, ingName));
            ingredientPanel.add(ingLabel);
            ingredientPanel.add(ingButton);
            ingredientPanel.add(Box.createRigidArea(new Dimension(300, 0)));
        }

        // create and add addons title
        JLabel addonsTitleLabel = new JLabel("Add-ons");
        addonsTitleLabel.setFont(textFont);
        addonsTitleLabel.setForeground(textColor);
        addonsPanel.add(addonsTitleLabel);
        addonsPanel.add(Box.createRigidArea(new Dimension(300, 0)));
        f.add(addonsSP, BorderLayout.EAST);

        // generate add-ons buttons
        int numAddons = o.AddOnsForGUI.size(); // change depending on number of add-ons
        String addonName = "ITEM"; // change depending on add-on item name
        for (int i = 0; i < numAddons; i++) {
            addonName = o.AddOnsForGUI.get(i);
            JLabel addonLabel = new JLabel(addonName);
            addonLabel.setFont(new Font(null, Font.PLAIN, 20));
            addonLabel.setForeground(textColor);
            JButton addonButton = new JButton("+");
            addonButton.addActionListener(new customizeWindowActionListener(o, m, addonName));
            addonsPanel.add(addonLabel);
            addonsPanel.add(addonButton);
            addonsPanel.add(Box.createRigidArea(new Dimension(300, 0)));
        }
    }
}
