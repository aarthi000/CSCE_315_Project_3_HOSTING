import java.sql.*;
import java.awt.*;
import java.util.*;

import javax.swing.*;

/**
 * This class contains the frontend functionality for the window that displays the summary of a placed order. 
 */
public class summaryWindow {
    JFrame f;

    /**
     * [summaryWindow a window that provides a summary of the order]
     * @param orderSummary  [description]
     */
    public summaryWindow(ArrayList<String> orderSummary) {
        // frame and set properties
        f = new JFrame("Order Summary");
        f.setSize(500, 500);
        f.setLayout(new FlowLayout());
        f.getContentPane().setBackground(new Color(238, 167, 60));

        // title label
        JLabel title = new JLabel("Order Summary");
        title.setFont(new Font(null, Font.PLAIN, 28));
        title.setForeground(Color.BLACK);
        f.add(title);
        f.add(Box.createRigidArea(new Dimension(500, 10)));

        // order summary information
        for (int i = 0; i < orderSummary.size(); i++) {
            JLabel summaryText = new JLabel(orderSummary.get(i));
            summaryText.setFont(new Font(null, Font.PLAIN, 20 /* change to adjust font size */));
            summaryText.setForeground(Color.BLACK);
            f.add(summaryText);
            f.add(Box.createRigidArea(new Dimension(500, 10 /* change to adjust vertical gap between labels */)));
        }
    }
}
