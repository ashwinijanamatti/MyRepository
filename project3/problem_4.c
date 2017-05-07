#include<stdio.h>
#include<stdlib.h>
#include<unistd.h>
#include<pthread.h>
#include<assert.h>
#include<sched.h>

/*
 *  * atomic_cmpxchg
 *   * 
 *    * equivalent to atomic execution of this code:
 *     *
 *      * if (*ptr == old) {
 *       *   *ptr = new;
 *        *   return old;
 *         * } else {
 *          *   return *ptr;
 *           * }
 *            *
 *             */

struct spin_lock_t {

      volatile int lock;
};

struct spin_lock_t *lock_holder;

volatile unsigned int in_cs=0;

volatile unsigned int *cs_count;
unsigned int seconds;
time_t start;

static inline int atomic_cmpxchg (volatile int *ptr, int old, int new)
{
  int ret;
  asm volatile ("lock cmpxchgl %2,%1"
    : "=a" (ret), "+m" (*ptr)     
    : "r" (new), "0" (old)      
    : "memory");         
  return ret;                            
}

void spin_lock (struct spin_lock_t *s) {

	while(atomic_cmpxchg(&s->lock,0,1)) {}
	return;
}


void spin_unlock (struct spin_lock_t *s){

	s->lock=0;

}

void *thread_function (void *arg) {
	
	int *i = (int *)arg;
	time_t current;
	time(&current);
	while(seconds > difftime(current,start)) {
		time(&current);
		spin_lock(lock_holder);

		//critical section
		assert(in_cs==0);
		in_cs++;
		assert(in_cs==1);
		in_cs++;
		assert(in_cs==2);
		in_cs=0;
		cs_count[*i]++;

		spin_unlock(lock_holder);

	}
	pthread_exit(NULL);
}

int main(int argc, char* argv[]){

	if (argc != 3) {

                printf("Please enter the at least two input variabes\n");
                return EXIT_FAILURE;

        }

	unsigned int number_of_threads = atoi(argv[1]);
	seconds = atoi(argv[2]);

	if(!number_of_threads || !seconds || number_of_threads>99) {

                printf("Please enter the correct input, exiting\n");
                return EXIT_FAILURE;
        }

	int tid[number_of_threads];
	lock_holder = (struct spin_lock_t*)malloc(sizeof(struct spin_lock_t));
	lock_holder->lock = 0;
	unsigned int i;

	pthread_t thread[number_of_threads];
	cs_count = (unsigned int *) malloc (number_of_threads*sizeof(unsigned int));

	if (lock_holder == NULL || cs_count == NULL){

		printf("Malloc failed, exiting...\n");
		return EXIT_FAILURE;
	}

	time(&start);

	for(i=0;i<number_of_threads;i++){
		
		tid[i] = i;
		cs_count[i] = 0;
		if(pthread_create(&thread[i],NULL,thread_function,&tid[i])) {

			printf("pthread creation failed\n");
			return EXIT_FAILURE;
		}
	}


	for(i=0;i<number_of_threads;i++) {

		if(pthread_join(thread[i],NULL)) {
			printf("join failed");
			return EXIT_FAILURE;
		}
		printf("thread id: %d\n",i);
		printf("critical sections: %d\n",cs_count[i]);
	}


	return EXIT_SUCCESS;
}
	
