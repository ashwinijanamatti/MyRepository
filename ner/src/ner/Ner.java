/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ner;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;

/**
 *
 * @author Owner
 */
public class Ner {
    
    
    
    //public dictionary head;
    public static int count = 0;
    public static int countwords = 0;
    public static dictionary last;
    public static Map<String, Integer> uniquewords = new Hashtable<String, Integer>();
    public static Map<String, Integer> postags = new Hashtable<String, Integer>();
    
    public static int label(String object){
        
        //System.out.println(object);
        if(object.compareTo("O") == 0)
            return 0;
        else if(object.compareTo("B-PER") == 0)
            return 1;
        else if(object.compareTo("I-PER") == 0)
            return 2;
        else if(object.compareTo("B-LOC") == 0)
            return 3;
        else if(object.compareTo("I-LOC") == 0)
            return 4;
        else if(object.compareTo("B-ORG") == 0)
            return 5;
        else 
            return 6;
        
    }
    
    
    public static void wordner(dictionary head, String filename)throws IOException{
        
        PrintWriter writer = new PrintWriter("C:\\Users\\Owner\\Documents\\GitHub\\programming_assignment1\\"+filename + ".word", "UTF-8");
        
        int localcount = 0;
        
        while (head!=null){
            
            localcount++;
            if(localcount == count)
                break;
            
            writer.println(label(head.biotag)+" "+head.id+":"+1);
            head = head.next;
                       
        }
        
        writer.close();
        
    }
    
    public static void wordcapner(dictionary head, String filename)throws IOException{
        
        PrintWriter writer = new PrintWriter("C:\\Users\\Owner\\Documents\\GitHub\\programming_assignment1\\"+filename + ".wordcap", "UTF-8");
        
        int localcount = 0;
        
        while (head!=null){
            
            localcount++;
            if(localcount == count)
                break;
            
            writer.print(label(head.biotag)+" "+head.id+":"+1);
            
            if(head.word.matches("^[A-Z]")){
                
                    writer.print(" "+count+":"+1);
            }
            
            writer.println();
            head = head.next;
        }
        
        writer.close();
        
    }
    
    public static void posconner(String filename, String type) throws IOException {
        
        BufferedReader br = new BufferedReader(new FileReader("C:\\Users\\Owner\\Documents\\GitHub\\programming_assignment1\\"+filename));
        String line;
        String buffer0 = "";
        List<String> list = new ArrayList<String>();
        
        PrintWriter writer = new PrintWriter("C:\\Users\\Owner\\Documents\\GitHub\\programming_assignment1\\"+filename + ".poscon", "UTF-8");
        
        while ((line = br.readLine()) !=null){
            
            list.add(line);
            
        }
        br.close();
        int index = 0;
        
        ArrayList bufferoflines = new ArrayList();
        //int index = 0;
        for(int i=0;i<list.size();i++){
            
            String[] splitwords = list.get(i).split("\\s+");
            if(splitwords.length<3)
                    continue;
            if(i==0){
                
                String[] next = list.get(i).split("\\s+");
                buffer0 = label(splitwords[0])+" "+uniquewords.get("curr-"+splitwords[2])+":"+1
                        +" "+postags.get("prev-PHIPOS")+":"+1
                        +" "+postags.get("next-"+next[1])+":"+1;
            }
            else if(i<list.size()-1){
                
                String[] prev = list.get(i-1).split("\\s+");
                String[] next = list.get(i+1).split("\\s+");
                
                
                buffer0 = label(splitwords[0])+" "+uniquewords.get("curr-"+splitwords[2])+":"+1;
                if(prev.length<3)
                    buffer0 += " "+postags.get("prev-PHIPOS")+":"+1;
                else
                    buffer0 += " "+postags.get("prev-"+prev[1])+":"+1;
                
                if(next.length<3)
                    buffer0 += " "+postags.get("next-OMEGAPOS")+":"+1;
                else
                    buffer0 += " "+postags.get("next-"+next[1])+":"+1;
            }
            else {
                
                String[] prev = list.get(i-1).split("\\s+");
                buffer0 = label(splitwords[0])+" "+uniquewords.get("curr-"+splitwords[2])+":"+1;
                if(prev.length<3)
                    buffer0 += " "+postags.get("prev-PHIPOS")+":"+1;
                else
                    buffer0 += " "+postags.get("prev-"+prev[1])+":"+1;
                
                buffer0 += " "+postags.get("next-OMEGAPOS")+":"+1;
            }
            if(splitwords[2].matches("^[A-Z]"))
                    buffer0 += " "+uniquewords.get("capitalization")+":"+1;
            
            //if(!bufferoflines.contains(buffer0))
                bufferoflines.add(buffer0);
            
            //System.out.println(bufferoflines.get(index));
            //tempwriter.println(buffer0);
            index++;
        }
        
        for(int i=0;i<bufferoflines.size()-1;i++){
            
            String minstring = bufferoflines.get(i).toString();
            
            String splitstring[] = minstring.split(" ");
            int value = Integer.parseInt(splitstring[1].split(":")[0]);
            int minindex = i;
            for(int j=i;j<bufferoflines.size();j++){
                
                String thisstring = bufferoflines.get(j).toString();
            
                String thissplitstring[] = thisstring.split(" ");
                int thisvalue = Integer.parseInt(thissplitstring[1].split(":")[0]);
                
                if(value>thisvalue){
                    
                    minindex = j;
                    value = thisvalue;
                    
                }
            }
            
            //System.out.println("i = "+i);
            //System.out.println("minindex = "+minindex);
            String temp = bufferoflines.get(i).toString();
            bufferoflines.set(i, bufferoflines.get(minindex));
            bufferoflines.set(minindex, temp);
            writer.println(bufferoflines.get(i));
        }
        
        writer.close();
           
    }
    
    public static void lexconner(String filename, String type) throws IOException {
        
        BufferedReader br = new BufferedReader(new FileReader("C:\\Users\\Owner\\Documents\\GitHub\\programming_assignment1\\"+filename));
        String line;
        String buffer0 = "";
        List<String> list = new ArrayList<String>();
        
        PrintWriter writer = new PrintWriter("C:\\Users\\Owner\\Documents\\GitHub\\programming_assignment1\\"+filename + ".lexcon", "UTF-8");
        
        while ((line = br.readLine()) !=null){
            
            list.add(line);
            
        }
        br.close();
        
        for(int i=0;i<list.size();i++){
            
            String[] splitwords = list.get(i).split("\\s+");
            if(splitwords.length<3)
                    continue;
            if(i==0){
                
                String[] next = list.get(i).split("\\s+");
                buffer0 = label(splitwords[0])+" "+uniquewords.get("curr-"+splitwords[2])+":"+1
                        +" "+uniquewords.get("prev-PHI")+":"+1
                        +" "+uniquewords.get("next-"+next[2])+":"+1;
            }
            else if(i<list.size()-1){
                
                String[] prev = list.get(i-1).split("\\s+");
                String[] next = list.get(i+1).split("\\s+");
                
                
                buffer0 = label(splitwords[0])+" "+uniquewords.get("curr-"+splitwords[2])+":"+1;
                if(prev.length<3)
                    buffer0 += " "+uniquewords.get("prev-PHI")+":"+1;
                else
                    buffer0 += " "+uniquewords.get("prev-"+prev[2])+":"+1;
                
                if(next.length<3)
                    buffer0 += " "+uniquewords.get("next-OMEGA")+":"+1;
                else
                    buffer0 += " "+uniquewords.get("next-"+next[2])+":"+1;
            }
            else {
                
                String[] prev = list.get(i-1).split("\\s+");
                buffer0 = label(splitwords[0])+" "+uniquewords.get("curr-"+splitwords[2])+":"+1;
                if(prev.length<3)
                    buffer0 += " "+uniquewords.get("prev-PHI")+":"+1;
                else
                    buffer0 += " "+uniquewords.get("prev-"+prev[2])+":"+1;
                
                buffer0 += " "+uniquewords.get("next-OMEGA")+":"+1;
            }
            if(splitwords[2].matches("^[A-Z]"))
                    buffer0 += " "+uniquewords.get("capitalization")+":"+1;
            
            writer.println(buffer0);
            
        }
        writer.close();
    }
    
    public static void bothconner(String filename, String type) throws IOException {
        
        BufferedReader br = new BufferedReader(new FileReader("C:\\Users\\Owner\\Documents\\GitHub\\programming_assignment1\\"+filename));
        String line;
        String buffer0 = "";
        List<String> list = new ArrayList<String>();
        
        PrintWriter writer = new PrintWriter("C:\\Users\\Owner\\Documents\\GitHub\\programming_assignment1\\"+filename + ".bothcon", "UTF-8");
        
        while ((line = br.readLine()) !=null){
            
            list.add(line);
            
        }
        br.close();
        
        for(int i=0;i<list.size();i++){
            
            String[] splitwords = list.get(i).split("\\s+");
            if(splitwords.length<3)
                    continue;
            if(i==0){
                
                String[] next = list.get(i).split("\\s+");
                buffer0 = label(splitwords[0])+" "+uniquewords.get("curr-"+splitwords[2])+":"+1
                        +" "+uniquewords.get("prev-PHI")+":"+1
                        +" "+uniquewords.get("next-"+next[2])+":"+1
                        +" "+postags.get("prev-PHIPOS")+":"+1
                        +" "+postags.get("next-"+next[1])+":"+1;
            }
            else if(i<list.size()-1){
                
                String[] prev = list.get(i-1).split("\\s+");
                String[] next = list.get(i+1).split("\\s+");
                
                
                buffer0 = label(splitwords[0])+" "+uniquewords.get("curr-"+splitwords[2])+":"+1;
                if(prev.length<3)
                    buffer0 += " "+uniquewords.get("prev-PHI")+":"+1;
                else
                    buffer0 += " "+uniquewords.get("prev-"+prev[2])+":"+1;
                
                if(next.length<3)
                    buffer0 += " "+uniquewords.get("next-OMEGA")+":"+1;
                else
                    buffer0 += " "+uniquewords.get("next-"+next[2])+":"+1;
                
                if(prev.length<3)
                    buffer0 += " "+postags.get("prev-PHIPOS")+":"+1;
                else
                    buffer0 += " "+postags.get("prev-"+prev[1])+":"+1;
                
                if(next.length<3)
                    buffer0 += " "+postags.get("next-OMEGAPOS")+":"+1;
                else
                    buffer0 += " "+postags.get("next-"+next[1])+":"+1;
            }
            else {
                
                String[] prev = list.get(i-1).split("\\s+");
                buffer0 = label(splitwords[0])+" "+uniquewords.get("curr-"+splitwords[2])+":"+1;
                if(prev.length<3)
                    buffer0 += " "+uniquewords.get("prev-PHI")+":"+1;
                else
                    buffer0 += " "+uniquewords.get("prev-"+prev[2])+":"+1;
                
                buffer0 += " "+uniquewords.get("next-OMEGA")+":"+1;
                
                if(prev.length<3)
                    buffer0 += " "+postags.get("prev-PHIPOS")+":"+1;
                else
                    buffer0 += " "+postags.get("prev-"+prev[1])+":"+1;
            }
            if(splitwords[2].matches("^[A-Z]"))
                    buffer0 += " "+uniquewords.get("capitalization")+":"+1;
            
            writer.println(buffer0);
            
        }
        writer.close();
    }
   
    public static void testcreatewordlist(String filename,String type) throws IOException{
        
        BufferedReader br = new BufferedReader(new FileReader("C:\\Users\\Owner\\Documents\\GitHub\\programming_assignment1\\"+filename));
        String line;
        
        while ((line = br.readLine()) !=null){
            
            String[] b = line.split("\\s+");
            
            if(b.length<2)
                continue;
            
            if(!uniquewords.containsKey("prev-"+b[2])){
                
                countwords++;
                
                uniquewords.put("curr-"+b[2], countwords);
                uniquewords.put("prev-"+b[2], countwords);
                uniquewords.put("next-"+b[2], countwords);
            }
            
            if(!postags.containsKey("prev-"+b[1])){
                
                countwords++;
                postags.put("prev-"+b[1], countwords);
                postags.put("next-"+b[1], countwords);
            }
        }
        
        if(!uniquewords.containsKey("prev-PHI")){
                countwords++;
                
                uniquewords.put("curr-PHI", countwords);
                uniquewords.put("prev-PHI", countwords);
                uniquewords.put("next-PHI", countwords);
        }
        if(!uniquewords.containsKey("prev-OMEGA")){
                countwords++;
                uniquewords.put("curr-OMEGA", countwords);
                uniquewords.put("prev-OMEGA", countwords);
                uniquewords.put("next-OMEGA", countwords);
        }
        if(!uniquewords.containsKey("prev-UNKWORD")){
                countwords++;
                uniquewords.put("curr-UNKWORD", countwords);
                uniquewords.put("prev-UNKWORD", countwords);
                uniquewords.put("next-UNKWORD", countwords);
        }
        if(!uniquewords.containsKey("prev-PHIPOS")){
                countwords++;
                postags.put("prev-PHIPOS", countwords);
                postags.put("next-PHIPOS", countwords);
        }
        if(!uniquewords.containsKey("prev-OMEGAPOS")){
                countwords++;
                postags.put("prev-OMEGAPOS", countwords);
                postags.put("next-OMEGAPOS", countwords);
        }
        if(!uniquewords.containsKey("prev-UNKPOS")){
                countwords++;
                postags.put("prev-UNKPOS", countwords);
                postags.put("next-UNKPOS", countwords);
        }
        countwords++;
        
        if(!uniquewords.containsKey("capitalization"))
            uniquewords.put("capitalization",countwords);
        
        //System.out.println(uniquewords.get("capitalization"));
        
    }
    
    
    public static dictionary createWordList(String filename, dictionary head, String type) throws IOException {
        
        
        BufferedReader br = new BufferedReader(new FileReader("C:\\Users\\Owner\\Documents\\GitHub\\programming_assignment1\\"+filename));
        String line;
        
        while ((line = br.readLine()) !=null){

            String[] b = line.split("\\s+");
            
            if(b.length<3)
                continue;
            
            count++;
            dictionary temp = new dictionary();
            
            temp.id = count;
            temp.biotag = b[0];
            temp.tag = b[1];
            temp.word = b[b.length - 1];
            temp.next = null;

            if (count == 1){
                
                head = temp;
                last = temp;
            }
            else {
                
                last.next = temp;
                last = temp;
            }
            
        }
        
        if(type.compareTo("word")!=0){
        
            dictionary temp = new dictionary();
            
            temp.id = count;
            temp.word = type;
            temp.next = null;
            
            last.next = temp;
                last = temp;
                
        }
        
        br.close();
        
        return head;
        
    }
    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws IOException {
        // TODO code application logic here
        
        dictionary trainhead = new dictionary();
        //dictionairy_for_context contexttrainhead = new dictionairy_for_context();
        //dictionary testhead = new dictionary();
               
        if(args.length < 3){
            
            System.out.println("Please enter 3 arguments: ner <train file> <test file> <ftype>");
            
            System.out.println(args[0]);
            return;
        }
        
        
        if(args[2].compareTo("word")== 0){
            
            trainhead = createWordList(args[0], trainhead, args[2]);
            wordner(trainhead,args[0]);
        }
        else if (args[2].compareTo("wordcap")== 0){
            
            trainhead = createWordList(args[0], trainhead, args[2]);
            wordcapner(trainhead,args[0]);
        }
        else if (args[2].compareTo("poscon")== 0){
            
            testcreatewordlist(args[0], args[2]);
            testcreatewordlist(args[1], args[2]);
            posconner(args[0], args[2]);
            posconner(args[1], args[2]);
        }
        else if (args[2].compareTo("lexcon")== 0){
            
            testcreatewordlist(args[0], args[2]);
            testcreatewordlist(args[1], args[2]);
            lexconner(args[0], args[2]);
            lexconner(args[1], args[2]);
        }
        else if (args[2].compareTo("bothcon")== 0){
            
            testcreatewordlist(args[0], args[2]);
            testcreatewordlist(args[1], args[2]);
            bothconner(args[0], args[2]);
            bothconner(args[1], args[2]);
        }
        else {
            
            System.out.println("Please enter a valid ftype, valid types include word,wordcap,poscon,lexcon,bothcon");
            return;
        }
    }    
}
