/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package findingl;

import java.io.BufferedReader;
import java.io.FileReader;
import java.lang.*;
import java.io.*;
/**
 *
 * @author Owner
 */
public class FindingL {

    /**
     * @param args the command line arguments
     */
    public static double[] lvalues = new double[168];

    public static double min(double a,double b){

        if(a<b)
            return a;
        else
            return b;
    }

    public static void calculateL(double tjminus1[],double tj[],double tjplus1[]) {

        double l =0;

        for(int i=0;i<lvalues.length;i++){

            if(i==0)
                continue;
            
            l = min( Math.log(tjplus1[i]/tj[i]) , Math.log(tj[i]/tjminus1[i]) );
            //System.out.println(l);

            if(l<0 || l>0.3){

                int j=i+1;


                while(l<0 || l>0.3){

                    l = min( Math.log(tjplus1[j]/tj[i]) , Math.log(tj[i]/tjminus1[i]));

                    j++;
                }

            }

            lvalues[i] = l;

        }

    }

    public static void main(String[] args) throws IOException {

        double[] tjminus1 = new double[168];
        double[] tj = new double[168];
        double[] tjplus1 = new double[168];

        int count = 0;
        int lines = 0;

        BufferedReader br = new BufferedReader(new FileReader("C:\\Users\\Owner\\Documents\\GitHub\\arjun\\src\\test.csv"));
        String line;

        while ((line = br.readLine()) !=null){

            String[] b = line.split(",");


            if(lines == 0) {
                lines++;
                continue;
            }

            if(count == 168)
                break;

                tjminus1[count] = Double.parseDouble(b[3]);
                tj[count] = Double.parseDouble(b[4]);
                tjplus1[count] = Double.parseDouble(b[5]);
                count++;


        }
        br.close();

        calculateL(tjminus1,tj,tjplus1);
        
        for(int i=0;i<lvalues.length;i++)
            System.out.println(lvalues[i]);

    }
}
