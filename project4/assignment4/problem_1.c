#include<stdio.h>
#include<unistd.h>
#include<stdlib.h>
#include<pthread.h>
#include<assert.h>
#include<stdbool.h>
#include<stdint.h>
#include<inttypes.h>

time_t start;
volatile unsigned long time_to_exec;
volatile int number_of_dogs = 0, number_of_cats = 0, number_of_birds = 0;
volatile int dogs = 0, cats = 0, birds = 0;
volatile int dog_total = 0, cat_total = 0, bird_total = 0;

struct monitor{
	pthread_mutex_t lock;
	pthread_cond_t dog;
	pthread_cond_t cat;
	pthread_cond_t bird;
};
struct monitor *m;

void play(void)
{
	int i;
	for (i=0; i<10; i++) {

		assert(cats >= 0 && cats <= number_of_cats);
		assert(dogs >= 0 && dogs <= number_of_dogs);
		assert(birds >= 0 && birds <= number_of_birds);
		assert(cats == 0 || dogs == 0);
		assert(cats == 0 || birds == 0);
	}
}


void dog_exit(void)
{

	pthread_mutex_lock(&m->lock);

	//decrement the number of dogs in playground
	dogs--;

	//if all dogs have exited and someone else is waiting on the dog exiting condition, broadcast it to them
	if(dogs == 0) {

		pthread_cond_broadcast(&m->dog);
	}

	pthread_mutex_unlock(&m->lock);
}

void cat_exit(void)
{

	pthread_mutex_lock(&m->lock);

	//decrement the number of cats in playground
	cats--;

	//if all cats have exited and someone else is waiting on the cat exiting condition, broadcast it to them
	if(cats == 0){

		pthread_cond_broadcast(&m->cat);
	}

	pthread_mutex_unlock(&m->lock);
}

void bird_exit(void)
{
	pthread_mutex_lock(&m->lock);
	birds--;

	if(birds == 0){

		pthread_cond_broadcast(&m->bird);
	}

	pthread_mutex_unlock(&m->lock);
}

void dog_enter(void)
{
	pthread_mutex_lock(&(m->lock));

	//wait for all cats to exit the playground
	while(cats != 0) {

		pthread_cond_wait(&m->cat,&m->lock);
	}

	dog_total++;
	dogs++;

	pthread_mutex_unlock(&(m->lock));

	play();

	dog_exit();
}



void cat_enter(void)
{
	pthread_mutex_lock(&m->lock);
	
	//wait for all dogs and birds to exit the playground
	while(dogs != 0 || birds != 0){

		if(birds != 0)
			pthread_cond_wait(&m->bird,&m->lock);
		else if(dogs != 0)
			pthread_cond_wait(&m->dog,&m->lock);
	}

	cat_total++;
	cats++;

	pthread_mutex_unlock(&m->lock);

	play();

	cat_exit();
}

void bird_enter(void)
{

	pthread_mutex_lock(&m->lock);

	while(cats != 0)
		pthread_cond_wait(&m->cat,&m->lock);

	birds++;
	bird_total++;

	pthread_mutex_unlock(&m->lock);

	play();

	bird_exit();
}


void *thread_function_for_dog(void * arg)
{

	time_t current_time;

	do {
		time(&current_time);
		dog_enter();
	}while(time_to_exec > difftime(current_time,start));

	return NULL;
}

void *thread_function_for_cat(void *arg)
{
	time_t current_time;

	do {

		time(&current_time);
		cat_enter();
	}while(time_to_exec > difftime(current_time,start));

	return NULL;
}

void *thread_function_for_bird(void *arg)
{

	time_t current_time;

	do{
	time(&current_time);
	bird_enter();
	}while(time_to_exec > difftime(current_time,start));
	return NULL;
}

int main(int argc, char * argv[])
{

	int val, i = 0;
	m = (struct monitor*)malloc(sizeof(struct monitor));
	if(argc != 4)
	{
		printf("Invalid number of argments given to the program\n");
		return EXIT_FAILURE;
	}	
	
	number_of_dogs = atoi(argv[1]);
	number_of_cats = atoi(argv[2]);
	number_of_birds = atoi(argv[3]);

	if(number_of_dogs < 1 || number_of_dogs > 99 || number_of_cats < 1 || number_of_cats > 99 || number_of_birds < 1 || number_of_birds > 99){

		printf("Invalid value given for number of threads. It should be between 1 to 99\n");
		return EXIT_FAILURE;
	}
	
	time_to_exec = 10;
	pthread_t dog_thread[number_of_dogs];
	pthread_t cat_thread[number_of_cats];
	pthread_t bird_thread[number_of_birds];

	time(&start);
	
	for( i = 0 ; i < number_of_dogs ; i++ ){

		if((val = pthread_create(&dog_thread[i],NULL,thread_function_for_dog,NULL))) {

			printf("thread creation failed\n");
			return EXIT_FAILURE;
  		}
	}
	
	for( i = 0 ; i < number_of_cats ; i++ ){

		
		if((val = pthread_create(&cat_thread[i],NULL,thread_function_for_cat,NULL))) {

			printf("thread creation failed\n");
			return EXIT_FAILURE;
  		}
	}
	
	for( i = 0 ; i < number_of_birds ; i++ ){

		
		if((val = pthread_create(&bird_thread[i],NULL,thread_function_for_bird,NULL))) {
			printf("thread creation failed\n");
			return EXIT_FAILURE;
  		}
	}

	for(i = 0 ; i < number_of_dogs ; i++){

		void *ret_val;
		if((val = pthread_join(dog_thread[i],&ret_val)))
		{
			printf("thread joining failed in dogs\n");
			return EXIT_FAILURE;
		}
	}

	for(i = 0 ; i < number_of_cats ; i++){

		void *ret_val;
		if((val = pthread_join(cat_thread[i],&ret_val)))
		{
			printf("thread joining failed in cats\n");
			return EXIT_FAILURE;
		}
	}

	for(i = 0 ; i < number_of_birds ; i++){

		void *ret_val;
		if((val = pthread_join(bird_thread[i],&ret_val)))
		{
			printf("Thread joining failed in birds");
			return EXIT_FAILURE;
		}
	}

	printf("Dogs play : %d\n",dog_total);
	printf("Cats play: %d\n",cat_total);
	printf("Birds play: %d\n",bird_total);
	return 0;
}
