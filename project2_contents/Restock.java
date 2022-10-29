import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
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


/**
 * This class contains the frontend and backend functionality for the Restock report. 
 */
public class Restock {
    static JFrame f;

    /**
     * [Restock displays the restock window within inventory]
     * @param o  [OrderWindow o]
     */
    public Restock(OrderWindow o) {
        Panel panel = new Panel();

        Dimension panelSize = new Dimension(400, 600);
        Color panelColor = new Color(255, 241, 241);
        panel.setPreferredSize(panelSize);
        panel.setBackground(panelColor);

        f = new JFrame("Restock Report");
        f.setSize(650, 600);
        f.setLayout(new BorderLayout());
        f.getContentPane().setBackground(new Color(90, 6, 25));
        f.add(Box.createRigidArea(new Dimension(400, 20)));

        // add error message
        String  restockMsg = "\n\n\n"
                            + "\tFollowing items need to be restocked\n" ;

        // Ignore exception, if we didn't get data, that means we return empty report
        try {
           ArrayList<String> restockList = o.getRestockReportData();
           //System.out.println("RestockList returned\n" + restockList);
           for(String itemName:restockList) {
                 restockMsg += "\n\t" + itemName;
           }
        }
        catch(Exception e) {}

        JTextArea restockText = new JTextArea(restockMsg);
        restockText.setFont(new Font(null, Font.PLAIN, 20));
        restockText.setForeground(Color.BLACK);
        restockText.setLineWrap(true);
        restockText.setWrapStyleWord(true);
        restockText.setSize(new Dimension(350, 225));
        restockText.setBackground(new Color(238, 167, 60));
        f.add(restockText);

    }
    public static void main(String[] args) throws Exception {
        //Restock o = new Restock();
        f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        f.setVisible(true);
    }
}
