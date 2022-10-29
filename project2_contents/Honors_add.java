
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
 * This class contains the frontend functionality for the Add Ons Report, also known as the Honor's report.
 */
public class Honors_add {
    static JFrame f;

    /**
     * [Constructor generates window for Add Ons report and calls backend function to generate report.]
     * @param addonStrings  [ArrayList of add ons of type String]
     */
    public Honors_add(ArrayList<String> addonStrings) {
        Panel panel = new Panel();

        Dimension panelSize = new Dimension(400, 600);
        Color panelColor = new Color(255, 241, 241);
        panel.setPreferredSize(panelSize);
        panel.setBackground(panelColor);

        f = new JFrame("Add Ons Report");
        f.setSize(650, 600);
        f.setLayout(new BorderLayout());
        f.getContentPane().setBackground(new Color(90, 6, 25));
        f.add(Box.createRigidArea(new Dimension(400, 20)));

        String msg = "\n\n\n"
                + "\t The following ingredients have been added on to cutomized menu item orders.\n";

        try {
            for (String s : addonStrings) {
                msg += "\n\t" + s;
            }
        } catch (Exception e) {
        }

        JTextArea restockText = new JTextArea(msg);
        restockText.setFont(new Font(null, Font.PLAIN, 20));
        restockText.setForeground(Color.BLACK);
        restockText.setLineWrap(true);
        restockText.setWrapStyleWord(true);
        restockText.setSize(new Dimension(350, 225));
        restockText.setBackground(new Color(238, 167, 60));
        f.add(restockText);

    }
}
