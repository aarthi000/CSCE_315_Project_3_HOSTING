import java.sql.*;
import java.awt.*;
import javax.swing.*;

/**
 * This class contains the frontend functionality for the Error Window, which is called when there is an error.  
 */
public class ErrorWindow {
    JFrame f;

    /**
     * [ErrorWindow shows the error message in the dialog]
     * @param errorMsg  [String errorMsg is the specific message to be shown]
     */
    public ErrorWindow(String errorMsg) {
        // initialize frame and set properties
        f = new JFrame("Error");
        f.setSize(400, 250);
        f.setLayout(new FlowLayout());
        f.getContentPane().setBackground(new Color(238, 167, 60));

        // add title label
        JLabel title = new JLabel("Error");
        title.setFont(new Font(null, Font.PLAIN, 28));
        title.setForeground(Color.BLACK);
        title.setHorizontalAlignment(JLabel.CENTER);
        f.add(title);
        f.add(Box.createRigidArea(new Dimension(400, 20)));

        // add error message
        JTextArea errorText = new JTextArea(errorMsg);
        errorText.setFont(new Font(null, Font.PLAIN, 20));
        errorText.setForeground(Color.BLACK);
        errorText.setLineWrap(true);
        errorText.setWrapStyleWord(true);
        errorText.setSize(new Dimension(350, 225));
        errorText.setBackground(new Color(238, 167, 60));
        f.add(errorText);
    }
}
