#include<stdio.h>
#include<stdlib.h>
#include<pthread.h>
#include<unistd.h>

unsigned int number_of_threads;
volatile unsigned long points_inside = 0;
volatile unsigned long points;
pthread_mutex_t count_mutex;
unsigned int seconds;
time_t start;

int generate_points(){

	double X = 2.0*(double)rand() / (RAND_MAX) - 1.0;
        double Y = 2.0*(double)rand() / (RAND_MAX) - 1.0;
	
	if (((X * X) + (Y * Y)) <= 1) {
		return 1;
	}
	return 0;
}

void *thread_function(){

	time_t current;
	time(&current);
	while(seconds>difftime(current,start)) {
		int value = generate_points();

		time(&current);
		pthread_mutex_lock(&count_mutex);
		
		points++;
		points_inside+=value;//circle();

		pthread_mutex_unlock(&count_mutex);
	}

	pthread_exit(NULL);

}

int main(int argc, char* argv[]){

	if(argc!=3){
		printf("Please enter two inputs\n");
		return EXIT_FAILURE;
	}
	number_of_threads = atoi(argv[1]);
	seconds = atoi(argv[2]);
	if(!number_of_threads || !seconds || number_of_threads>99) {
		printf("Please the correct input values");
		return EXIT_FAILURE;
	}
	unsigned int i;
	pthread_t threads[number_of_threads];

	pthread_mutex_init(&count_mutex,NULL);
	

	for(i=0;i<number_of_threads;i++){

		
	 	if (pthread_create(&threads[i],NULL,thread_function,NULL)) {
			printf("pthread creation failed, exiting...\n");
			return EXIT_FAILURE;
		}
	}

	time(&start);

	for(i=0;i<number_of_threads;i++){

		if(pthread_join(threads[i],NULL)){
			printf("pthread join failed, exiting...\n");
			return EXIT_FAILURE;
		}
	}


	pthread_mutex_destroy(&count_mutex);

	double p;
	if(points == 0 || points_inside == 0) {

		printf("something went wrong in number generation");
		return EXIT_FAILURE;
	}
	p = (double)(4*points_inside)/(double)points;

	printf("The pi value is %lf\n",(p));

	return EXIT_SUCCESS;
}
