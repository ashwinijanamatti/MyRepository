#include<stdio.h>
#include<pthread.h>
#include<stdlib.h>
#include<assert.h>

volatile int in_cs = 0;
int *cs_count = NULL;
int *choosing = NULL;
int *number = NULL;
int number_of_threads = 0;

void mfence(void);

void *thread_function (void *arg) {

	pthread_detach( pthread_self() );
	int *i = (int *) arg;
	int j;
	while(1) {
		//contend for lock
		mfence();
		choosing[*i] = 1;
		mfence();
		number [*i] = max () + 1 ;
		mfence();
		choosing [*i] = 0;
		mfence();
		for ( j = 0 ; j < number_of_threads; j++) {
			mfence();
			while ( choosing [j] ) {

				mfence(); 
			}
			mfence();
			if((number[j]>0) && ((number[j] < number[*i])|| (number[j] == number[*i]) && (j < *i))) { //&& (cs_count[j]!=0 && cs_count[j] < cs_count[*i])) {//){ //&& cs_count[j] < cs_count[*i]) {
				
				while (number[j] > 0) {

				//	mfence();
				}
				mfence();
			}
		}

		//acquire lock and enter critical section
		//critical section
		assert (in_cs==0);
		in_cs++;
		assert (in_cs==1);
		in_cs++;
		assert (in_cs==2);
		in_cs++;
		assert (in_cs==3);
		in_cs=0;
		cs_count[*i]++;
	
		//release lock
		mfence();
		number[*i] = 0;
		mfence();
		
	}
	return NULL;

}

void mfence (void) {
  asm volatile ("mfence" : : : "memory");
}

int max() {

	int i;
	int value = number[0];
	for(i=1;i<number_of_threads;i++) {

		if(number[i]>value) {
			value = number[i];
		}
	}

	return value;
}

void main(int argc, char* argv[]) {

	number_of_threads = atoi(argv[1]);
	int seconds_to_run = atoi(argv[2]);
	int i=0;
//	printf("checkpoint 1\n");
	choosing = (int *)malloc(sizeof(int)*number_of_threads);
	number = (int *)malloc(sizeof(int)*number_of_threads);
	cs_count = (int *)malloc(number_of_threads*sizeof(int));
	if (choosing == NULL || number == NULL) {
		printf("error");
		return;
	}
	int tid[number_of_threads];
//	printf("checkpoint 2\n");
	pthread_t thread[number_of_threads];

/*	for (i =0 ;i<number_of_threads;i++) {

		*(number+i)=0;
		*(choosing+i)=0;
		*(cs_count+i)=0;
	}*/	
	
	for(i=0;i<number_of_threads;i++) {

//		printf("checkpoint %d\n",3+i);
//		number[i] = malloc(sizeof(int));
		number[i] = 0;
//		choosing[i] = (int *)malloc(sizeof(int));
		choosing[i] = 0;
//		cs_count[i] = (int *)malloc(sizeof(int));

		cs_count[i] = 0;
		tid[i] = i;
//		printf("checkpoint %d\n",4+i);
		//tid = i;
		if((pthread_create(&thread[i], NULL, thread_function, &tid[i]))) {
			printf("error");
			return;
		}
	}

	usleep(seconds_to_run*1000000);
	unsigned long sum = 0;
	
	for(i=0;i<number_of_threads;i++) {

		printf("thread id : %d \n",i);
		printf("number of times entered critical section : %d\n",*(cs_count+i));
		printf("\n");
		sum+=cs_count[i];
	}

	printf("\ntotal number of critical sections of all threads : %u\n",sum);

//	exit(3);
}
