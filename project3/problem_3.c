#include<stdio.h>
#include<sched.h>
#include<unistd.h>
#include<pthread.h>
#include<stdlib.h>
#include<assert.h>
#include<stdbool.h>

volatile int in_cs = 0;
int *cs_count = NULL;
int *choosing = NULL;
int *number = NULL;
int number_of_threads = 0;
bool done = false;

int max();

void *thread_function (void *arg) {

	int *i = (int *) arg;
	int j;
	while(!done) {
		//contend for lock
		choosing[*i] = 1;
		number [*i] = max () + 1 ;
		choosing [*i] = 0;
		for ( j = 0 ; j < number_of_threads; j++) {
			if(j!=*i){
			while ( choosing [j] ) { 
				sched_yield();
			}
			while((number[j]>0) && ((number[j] < number[*i])|| ((number[j] == number[*i]) && (j < *i)))) {//){ //&& cs_count[j] < cs_count[*i]) {
					sched_yield();
			}
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
		number[*i] = 0;

		//yield the core so that other threads notice that number is reset and have a chance to enter their critical section, kinda for implementing fairness, i could have used a usleep here instead
		sched_yield();
		
	}
	return NULL;

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

int main(int argc, char* argv[]) {

	if(argc!=3) {

		printf("Please enter two inputs\n");
		return EXIT_FAILURE;
	}

	number_of_threads = atoi(argv[1]);
	int seconds_to_run = atoi(argv[2]);

	if(!number_of_threads || !seconds_to_run) {

                printf("Please enter the correct input, exiting...\n");
                return EXIT_FAILURE;
        }

	int i=0;
	choosing = (int *)malloc(sizeof(int)*number_of_threads);
	number = (int *)malloc(sizeof(int)*number_of_threads);
	cs_count = (int *)malloc(number_of_threads*sizeof(int));

	if (choosing == NULL || number == NULL || cs_count == NULL) {

		printf("Malloc failed, exiting...\n");
		return EXIT_FAILURE;
	}

	int tid[number_of_threads];
	pthread_t thread[number_of_threads];

	
	for(i=0;i<number_of_threads;i++) {

		number[i] = 0;
		choosing[i] = 0;

		cs_count[i] = 0;

		tid[i] = i;
		if((pthread_create(&thread[i], NULL, thread_function, &tid[i]))) {
			printf("error");
			return EXIT_FAILURE;
		}
	}

	usleep(seconds_to_run*1000000);


	done = true;	
	for(i=0;i<number_of_threads;i++) {

		if(pthread_join(thread[i],NULL)) {
			printf("join failed\n");
			return EXIT_FAILURE;
		}
		printf("thread id: %d\n",i);
		printf("critical sections: %d\n",cs_count[i]);
	}

	return EXIT_SUCCESS;

}
