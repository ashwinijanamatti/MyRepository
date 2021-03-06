#define _GNU_SOURCE
#include <stdio.h>
#include <string.h>
#include <stdint.h>
#include <stdlib.h>
#include <sys/syscall.h> 
#include <unistd.h>
#include <fcntl.h>

/*********************************************************************
 *
 * These C functions use patterns and functionality often found in
 * operating system code. Your job is to implement them. Of course you
 * should write test cases. However, do not hand in your test cases
 * and (especially) do not hand in a main() function since it will
 * interfere with our tester.
 *
 * Additional requirements on all functions you write:
 *
 * - you may not refer to any global variables
 *
 * - you may not call any functions except those specifically
 *   permitted in the specification
 *
 * - your code must compile successfully on CADE lab Linux
 *   machines when using:
 *
 * /usr/bin/gcc -O2 -fmessage-length=0 -pedantic-errors -std=c99 -Werror -Wall -Wextra -Wwrite-strings -Winit-self -Wcast-align -Wcast-qual -Wpointer-arith -Wstrict-aliasing -Wformat=2 -Wmissing-include-dirs -Wno-unused-parameter -Wshadow -Wuninitialized -Wold-style-definition -c assign1.c 
 *
 * NOTE 1: Some of the specifications below are specific to 64-bit
 * machines, such as those found in the CADE lab.  If you choose to
 * develop on 32-bit machines, some quantities (the size of an
 * unsigned long and the size of a pointer) will change. Since we will
 * be grading on 64-bit machines, you must make sure your code works
 * there.
 *
 * NOTE 2: You should not need to include any additional header files,
 * but you may do so if you feel that it helps.
 *
 * HANDIN: submit your finished file, still called assign.c, in Canvas
 *
 *
 *********************************************************************/

/*********************************************************************
 *
 * byte_sort()
 *
 * specification: byte_sort() treats its argument as a sequence of
 * 8 bytes, and returns a new unsigned long integer containing the
 * same bytes, sorted numerically, with the smaller-valued bytes in
 * the lower-order byte positions of the return value
 * 
 * EXAMPLE: byte_sort (0x0403deadbeef0201) returns 0xefdebead04030201
 *
 *********************************************************************/

unsigned long byte_sort (unsigned long arg)
{
  unsigned long bytearray[8];

  unsigned int i;

  if (arg == 0) {

     return 0;
  }

  for (i=0;i<8;i++){
      bytearray[i] = (arg>>i*8) & 0xff;

  }

  unsigned int j;

  for (i=0;i<7;i++)
  {
     unsigned long min = bytearray[i];
     unsigned int index = i;

     for (j=i+1; j<8; j++)
     {
        if (bytearray[j]<min)
        {
           min = bytearray[j];
           index = j;
        }
     }
     unsigned long temp = bytearray[i];
     bytearray[i] = min;
     bytearray[index] = temp;

   }


  for (i=0;i<8;i++){

    if(i>0) {

       bytearray[i] = (bytearray[i]<<(i*8))+bytearray[i-1];
    }
  }


  return bytearray[7];
}

/*********************************************************************
 *
 * nibble_sort()
 *
 * specification: nibble_sort() treats its argument as a sequence of 16 4-bit
 * numbers, and returns a new unsigned long integer containing the same nibbles,
 * sorted numerically, with smaller-valued nibbles towards the "small end" of
 * the unsigned long value that you return
 *
 * the fact that nibbles and hex digits correspond should make it easy to
 * verify that your code is working correctly
 * 
 * EXAMPLE: nibble_sort (0x0403deadbeef0201) returns 0xfeeeddba43210000
 *
 *********************************************************************/

unsigned long nibble_sort (unsigned long arg)
{
  unsigned long bytearray[16];

  unsigned int i;

  if (arg == 0) {

     return 0;
  }


  for (i=0;i<16;i++){

    bytearray[i] = (arg>>i*4) & 0xf;

  }

  unsigned int j;

  for (i=0;i<15;i++)
  {
     unsigned long min = bytearray[i];
     unsigned int index = i;

     for (j=i+1; j<16; j++)
     {
        if (bytearray[j]<min)
        {
           min = bytearray[j];
           index = j;
        }
     }
     unsigned long temp = bytearray[i];
     bytearray[i] = min;
     bytearray[index] = temp;

   }


  for (i=0;i<16;i++){

    if(i>0)
       bytearray[i] = (bytearray[i]<<(i*4))+bytearray[i-1];

  }
   
   
  return bytearray[15];
   
}

/*********************************************************************
 *
 * name_list()
 *
 * specification: allocate and return a pointer to a linked list of
 * struct elts
 *
 * - the first element in the list should contain in its "val" field the first
 *   letter of your first name; the second element the second letter, etc.;
 *
 * - the last element of the linked list should contain in its "val" field
 *   the last letter of your first name and its "link" field should be a null
 *   pointer
 *
 * - each element must be dynamically allocated using a malloc() call
 *
 * - if any call to malloc() fails, your function must return NULL and must also
 *   free any heap memory that has been allocated so far; that is, it must not
 *   leak memory when allocation fails
 *  
 *********************************************************************/

struct elt {
  char val;
  struct elt *link;
};

struct elt *name_list (void)
{
   char name[] = "ASHWINI JANAMATTI";
   struct elt *start = (struct elt *)malloc(sizeof(*start));

   if(start == NULL)
   {
     return NULL;
   }

   struct elt *current = (struct elt*)malloc(sizeof(struct elt));

   if(sizeof(name)-1 > 0)
   {
      start->val = name[0];
      start->link = NULL;
   }
   else
   {
      return NULL;
   }

   current = start;
   unsigned int i = 0;

   for(i = 1 ; i < sizeof(name)-1 ; i++)
   {
      struct elt *temp = (struct elt*)malloc(sizeof(struct elt));

      if(temp == NULL)
      {

         current = start;

         while(start != NULL)
         {
            current = current->link;
            free(start);
            start = current;
         }

         return NULL;
      }

      temp->val = name[i];
      temp->link = NULL;
      current->link = temp;
      current = current->link;
    }

    
    return start;
}


/*********************************************************************
 *
 * convert()
 *
 * specification: depending on the value of "mode", print "value" as
 * octal, binary, or hexidecimal to stdout, followed by a newline
 * character
 *
 * extra requirement 1: output must be via putc()
 *
 * extra requirement 2: print nothing if "mode" is not one of OCT,
 * BIN, or HEX
 *
 * extra requirement 3: all leading/trailing zeros should be printed
 *
 * EXAMPLE: convert (HEX, 0xdeadbeef) should print
 * "00000000deadbeef\n" (including the newline character but not
 * including the quotes)
 *
 *********************************************************************/

enum format_t {
  OCT = 66, BIN, HEX
};

void convert (enum format_t mode, unsigned long value)
{
  char con[] = "0000000000000000000000000000000000000000000000000000000000000000";
  unsigned int index = 63;
  unsigned int start,end=index;

    

  if(mode == 68)
  {
    static char hexvalues[] = "0123456789abcdef";

    while (value > 0 && index > 47 ) 
    {
      con[index] = hexvalues[(value & 0xf)];
      index--;
      value >>= 4;
    }
    start = 48;
  }
  else if(mode == 66)
  {
    static char octalvalues[] = "01234567";

    while (value > 0 && index > 41 ) {

      con[index] = octalvalues[(value & 7)];
      index--;
      value >>= 3;
    }
    start = 42;
  }
  else if(mode == 67)
  {

    static char binaryvalues[] = "01";
    while (value > 0 ) {

      con[index] = binaryvalues[(value & 1)];
      index--;
      value >>= 1;
    }

    start = 0;

  }
  else{

    return;
  }

 
  unsigned int j = 0;

  for(j=start ; j <= end ; j++)
    putc(con[j],stdout);

  char newline[3] ="\\n"; 

  for(j=0;j<3;j++)
  putc(newline[j],stdout);

  return;
}

/*void convert (enum format_t mode, unsigned long value)
{
}*/

/*********************************************************************
 *
 * draw_me()
 *
 * this function creates a file called me.txt which contains an ASCII-art
 * picture of you (it does not need to be very big). the file must (pointlessly,
 * since it does not contain executable content) be marked as executable.
 * 
 * extra requirement 1: you may only call the function syscall() (type "man
 * syscall" to see what this does)
 *
 * extra requirement 2: you must ensure that every system call succeeds; if any
 * fails, you must clean up the system state (closing any open files, deleting
 * any files created in the file system, etc.) such that no trash is left
 * sitting around
 *
 * you might be wondering how to learn what system calls to use and what
 * arguments they expect. one way is to look at a web page like this one:
 * http://blog.rchapman.org/post/36801038863/linux-system-call-table-for-x86-64
 * another thing you can do is write some C code that uses standard I/O
 * functions to draw the picture and mark it as executable, compile the program
 * statically (e.g. "gcc foo.c -O -static -o foo"), and then disassemble it
 * ("objdump -d foo") and look at how the system calls are invoked, then do
 * the same thing manually using syscall()
 *
 *********************************************************************/

void draw_me (void)
{

char filename[] = "me.txt";

int filedesc = syscall(2,filename,O_WRONLY |  O_CREAT | O_EXCL, S_IRUSR | S_IWUSR | S_IXUSR);

if (filedesc < 0)
{
  syscall(60,EXIT_FAILURE);
}

char art[] = "                                                  _               \n                                                 / \\             \n                                                /   \\            \n                                               /     \\      \n                                              /   __  \\         \n                                             /   |__|  \\         \n                                            /           \\         \n                                           /_____________\\         \n                                           |             |         \n                                           |             |        \n                                           |             |         \n                                           |     ___     |         \n                                           |    |   |    |         \n                                           |    |  o|    |         \n                                           |____|   |____|         \n";


int ret = syscall(1,filedesc,art,1023);

if(ret != 1023){

  syscall(3,filedesc);
  syscall(87,filename);
  syscall(60,EXIT_FAILURE);
}

syscall(3,filedesc);

return;

}

