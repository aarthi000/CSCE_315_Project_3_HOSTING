import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.sql.*;


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
import java.util.Set;

/**
 * This class contains the frontend and backend functionality for the Sales Report. 
 */
public class Sales {
    static JFrame f;
    public static JTextField inputStart;
    public static JTextField inputEnd;

    /**
     * Creates a window that displays the number of sales of each menu item
     * @param o object that allows you to access all of the methods to manipulate the inventory
     * @param m object that allows you to access all of the methods within MenuItem.java
     */
    public Sales(OrderWindow o, MenuItem m) throws SQLException {
        Panel panel = new Panel();

        Dimension panelSize = new Dimension(900, 1200);
        Color panelColor = new Color(255, 241, 241);
        panel.setPreferredSize(panelSize);
        panel.setBackground(panelColor);

        f = new JFrame("Sales Report");
        f.setSize(900, 600);
        f.setLayout(new BorderLayout());
        f.getContentPane().setBackground(new Color(90, 6, 25));

        JPanel datePanel = new JPanel();
        datePanel.setPreferredSize(new Dimension(400, 800));
        datePanel.setBackground(panelColor);
        datePanel.setLayout(new FlowLayout());

        JLabel startLabel = new JLabel("Enter start date in D/M/YY format");
        JLabel endLabel = new JLabel("Enter end date in D/M/YY format");

        inputStart = new JTextField(20);
        inputEnd = new JTextField(20);

        JButton confirmButton = new JButton("Confirm");

        datePanel.add(Box.createRigidArea(new Dimension(380, 100)));
        datePanel.add(startLabel);
        datePanel.add(inputStart);
        datePanel.add(Box.createRigidArea(new Dimension(380, 10)));
        datePanel.add(Box.createRigidArea(new Dimension(380, 50)));
        datePanel.add(endLabel);
        datePanel.add(inputEnd);
        datePanel.add(Box.createRigidArea(new Dimension(380, 10)));
        datePanel.add(Box.createRigidArea(new Dimension(380, 50)));
        datePanel.add(confirmButton);
        f.add(datePanel, BorderLayout.EAST);

        confirmButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent ae) {
                String inputStartText = inputStart.getText();
                String inputEndText = inputEnd.getText();

                String salesMsg = "\n\n\n"
                                + "\t    Items Sold\n" ;

                // Ignore exception, if we didn't get data, that means we
                // return empty report
                try {
                    HashMap<String, Integer> itemSales = o.calculateSales(o, m, inputStartText, inputEndText, panel, f);
                    for (String itemName : itemSales.keySet()) {
                        salesMsg += "\n" + itemName + " - " + Integer.toString(itemSales.get(itemName));
                    }
                }
                catch(Exception a) {}

                JTextArea salesText = new JTextArea(salesMsg);
                salesText.setFont(new Font(null, Font.PLAIN, 20));
                salesText.setForeground(Color.BLACK);
                salesText.setLineWrap(true);
                salesText.setWrapStyleWord(true);
                salesText.setSize(new Dimension(450, 1500));
                panel.add(salesText);
                JScrollPane textSP = new JScrollPane(salesText);
                textSP.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
                textSP.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_ALWAYS);
                f.add(textSP);
                f.setVisible(true);
            }
        });
    }

    public static void main(String[] args) throws Exception {
        f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        f.setVisible(true);
    }
}
