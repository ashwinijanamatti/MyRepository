#include<stdio.h>
#include<stdlib.h>
#include<string.h>

enum format_t {
  OCT = 66, BIN, HEX
};

void convert (enum format_t mode, unsigned long value)
{ 
	char *result = malloc(sizeof(unsigned long));
//        strcpy(result, "0000000000000000");
	int index_val; 
	unsigned long temp = value;
        char outputstring[] = "The hexadecimal value is ";
	
	if(mode == 68)
	{	
		static char hex_values[] = "0123456789ABCDEF"; 
  strcpy(result,"0000000000000000");
  index_val = 15;
		while (value > 0 ) {
	                result[index_val--] = hex_values[(value & 0xF)];
                	value >>= 4;
        	}
//		strcpy(outputstring,"The hexadecimal value is");
	}
	else if(mode == 66)
	{
		static char octal_values[] = "01234567";
  strcpy(result,"0000000000000000000000");
  index_val = 21;
		while (value > 0 ) {
                        result[index_val--] = octal_values[(value & 7)];
                        value >>= 3;
                }
		strcpy(outputstring,"The octal value is ");
	}
	else if(mode == 67)
	{
  strcpy(result,"0000000000000000000000000000000000000000000000000000000000000000");
  index_val = 63;
		static char binary_values[] = "01";
		while (value > 0 ) {
                        result[index_val--] = binary_values[(value & 1)];
                        value >>= 1;
                }
		strcpy(outputstring,"The binary value is ");
	}
	else{
		return;
	}
	int j = 0;
  for(j=0;j<strlen(outputstring);j++)
    putc(outputstring[j],stdout);
	for(j=0 ; j < strlen(result) ; j++)
	{
		//printf("\n The char is %c\n",result[j]);
		putc(result[j],stdout);
	}
	//putc("\n",stdout);
}

void main(){
 
	convert(HEX,67902);
        convert(BIN,67902);
	convert(OCT,67902);
}
