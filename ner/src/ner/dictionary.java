/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ner;

/**
 *
 * @author Owner
 */
public class dictionary {
    
        public int id;
        public String biotag;
        public String tag;
        public String word;
        public dictionary next;
        
        public void dictionary(){
            
            this.id = 0;
            this.biotag = null;
            this.tag = null;
            this.word = null;
            this.next = null;
    }
              
}
