#include<stdio.h>


int main(int argc, char *argv[]) {

  int num;
  
  num = atoi(argv[1]);
   
  if (num == 0) {

    printf("The entered input is not a number or the number is 0\n");
    return 0;
  }


  if (num < 0) {

    printf("Entered a negative  number, terminating the program\n");
    return 0;
  }
  int pid;

  pid = fork();

  if(pid == 0) {

    printf("%d ",num);

    while (num!=1) {
    
      if(num%2 == 0) {

        num/=2;
        printf("%d ",num);

      }
      else {

        num = 3*num + 1 ;
        printf("%d ",num);

      }
    }
    printf("\n");
  }
  else if (pid>0) {

    wait(NULL);
  }
  else {

    printf("Failed to create a child");

  }

  return 0;

}
