import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.sql.*;
import javax.sound.midi.Track;
import javax.swing.table.AbstractTableModel;
import javax.swing.table.DefaultTableModel;
import javax.swing.border.Border;
import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionListener;
import javax.swing.event.*;
import java.awt.event.*;
import java.util.Map;
import java.util.Vector;
import java.util.HashMap;
import java.util.Iterator;

/**
 * This class contains the frontend and backend for the Excess report.
 */
public class Excess{
    static JFrame f;
    public static JTextField inputStart;
    public static JTextField inputEnd;

    /**
     * Creates a window populated with list items of excess
     * <p>
     * This method does not have a return value, but it does create the design for the excess page.
     * This includes creating buttons and calling the action listener to setup for a specific action.
     * @param o object that allows you to access all of the methods to manipulate the inventory
     * @param m object that allows you to access all of the methods within MenuItem.java
     */
    public Excess(OrderWindow o, MenuItem m) {
        Panel panel = new Panel();

        Dimension panelSize = new Dimension(700, 1000);
        Color panelColor = new Color(255, 241, 241);
        panel.setPreferredSize(panelSize);
        panel.setBackground(panelColor);

        f = new JFrame("Excess Report");
        f.setSize(900, 600);
        f.setLayout(new BorderLayout());
        f.getContentPane().setBackground(new Color(90, 6, 25));
        
        JPanel cBoxPanel = new JPanel();
        cBoxPanel.setPreferredSize(new Dimension(400, 800));
        cBoxPanel.setBackground(panelColor);
        cBoxPanel.setLayout(new FlowLayout());

        

        JLabel startLabel = new JLabel("Enter start date in M/D/YY format");
        JLabel endLabel = new JLabel("Enter end date in M/D/YY format");

        inputStart = new JTextField(20);
        inputEnd = new JTextField(20);
        
        JButton confirmButton = new JButton("Confirm");

        cBoxPanel.add(Box.createRigidArea(new Dimension(380, 100)));
        cBoxPanel.add(startLabel);
        cBoxPanel.add(inputStart);
        cBoxPanel.add(Box.createRigidArea(new Dimension(380, 10)));
        cBoxPanel.add(Box.createRigidArea(new Dimension(380, 50)));
        cBoxPanel.add(endLabel);
        cBoxPanel.add(inputEnd);
        cBoxPanel.add(Box.createRigidArea(new Dimension(380, 10)));
        cBoxPanel.add(Box.createRigidArea(new Dimension(380, 50)));
        cBoxPanel.add(confirmButton);
        f.add(cBoxPanel, BorderLayout.EAST);

        confirmButton.addActionListener(new ActionListener(){
            public void actionPerformed(ActionEvent ae){
               String inputStartText = inputStart.getText();
               String inputEndText = inputEnd.getText();

                String  excessMsg = "\n\n\n" 
                                + "\tItems in excess\n" ;
                                
                // Ignore exception, if we didn't get data, that means we 
                // return empty report
                
                try {
                    List<String> excessList = o.calculateExcess(o, m, inputStartText, inputEndText, panel, f);
                    for(int i = 0; i < excessList.size(); i++) {

                            excessMsg += "\n\t" + excessList.get(i);
                    
                    }

                }
                catch(Exception a) {}
        
                JTextArea excessText = new JTextArea(excessMsg);
                excessText.setFont(new Font(null, Font.PLAIN, 20));
                excessText.setForeground(Color.BLACK);
                excessText.setLineWrap(true);
                excessText.setWrapStyleWord(true);

                excessText.setSize(new Dimension(400, 800));
                //excessText.setBackground(new Color(238, 167, 60));
                panel.add(excessText);
                JScrollPane addSP = new JScrollPane(panel);
                addSP.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
                addSP.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_ALWAYS);
                f.add(panel);
                f.setVisible(true);
            }
        });
    }    

        public static void main(String[] args) throws Exception {
            f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            f.setVisible(true);
        }
}
