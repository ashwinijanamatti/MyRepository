/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package sudoku;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
/**
 *
 * @author Owner
 */
public class Sudoku {

    public static void checksquares(int[][] a, int row, int col){
        
        for(int ind = 1;ind<=9;ind++){
            
            boolean found = false;
            for(int i=row;i<row+3;i++){
            
                for(int j=col;j<col+3;j++){
                
                    if(a[i][j] == ind){
                        
                        found = true;
                        //System.out.println(a[i][j]);
                        break;
                    }
                
                }
                
                if(found)
                    break;
            }
            
            if(!found){
                
                System.out.println("Sudoku solution is wrong in squares");
                return;
            }
                
        }
        
    }
    
    public static void checker(int[][] a){
        
        //int count = 0;
        for(int ind = 1;ind<=9;ind++){

            boolean row = false;
            boolean col = false;
            
            for(int i=0;i<9;i++){
            
                for(int j=0;j<9;j++){
                
                    if(a[i][j] == ind){
                        row = true;
                        //break;
                    }
                    
                    if(a[j][i] == ind){
                        
                        col = true;
                        //break;
                    }
                    
                    if(i%3 == 0 && j%3 == 0){
                        
                        checksquares(a,i,j);
                    }
                }
                
                if(!row || !col){
                    
                    System.out.println("Sudoku solution is wrong");
                    return;
                }
                
            }
        }
        
        System.out.println("CORRECT!");
    }
    
    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws IOException{
        // TODO code application logic here
        
        BufferedReader br = new BufferedReader(new FileReader("C:\\Users\\Owner\\Documents\\sudoku.txt"));
        String line;
        int[][] su = new int[9][9];
        
        while((line = br.readLine())!= null){
            
            String[] s = line.split(",");
            
            if(s.length != 81)
                return;
            int count = 0;
            int inner = 0;
            int outer = 0;
            
            while (count<81){
                int count1 = 0;
                
                while(count1<9){
                    
                    su[inner][outer++] = Integer.parseInt(s[count].trim());
                    count++;
                    count1++;
                }
                inner++;
                outer = 0;
            }
        }
        
        checker(su);
    }
    
}
