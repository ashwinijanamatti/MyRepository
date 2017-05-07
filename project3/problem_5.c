#include<stdio.h>
#include<stdlib.h>
#include<pthread.h>
#include<assert.h>

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

int in_cs=0;

int *cs_count;

int *queue;

int front=0;
int rear=0;
int number_of_threads;

static inline int atomic_cmpxchg (volatile int *ptr, int old, int new)
{
  int ret;
  asm volatile ("lock cmpxchgl %2,%1"
    : "=a" (ret), "+m" (*ptr)     
    : "r" (new), "0" (old)      
    : "memory");         
  return ret;                            
}

void spin_unlock(struct spin_lock_t *s);

void spin_lock (struct spin_lock_t *s,int *i) {

	line: while(atomic_cmpxchg(&s->lock,0,1)) {}
	if(queue[front] == *i)
		return;
	else {
		//s->lock = 0;
		spin_unlock(s);
		goto line;
		//spin_lock(s,i);
	}
	
	//return;
}


void spin_unlock (struct spin_lock_t *s){

	s->lock=0;

}

void *thread_function (void *arg) {
	
	int *i = (int *)arg;
	while(1) {
		
		queue[rear] = *i;
		rear=(rear+1)%number_of_threads;
		spin_lock(lock_holder,i);
		queue[front] = 0;
		front=(front+1)%number_of_threads;

		//critical section
		assert(in_cs==0);
		in_cs++;
		assert(in_cs==1);
		in_cs++;
		assert(in_cs==2);
		in_cs++;
		assert(in_cs==3);
		in_cs=0;
		cs_count[*i]++;

		spin_unlock(lock_holder);	
		queue[rear] = *i;
		rear = (rear+1)%number_of_threads;

	}
}

void main(int argc, char* argv[]){

	number_of_threads = atoi(argv[1]);
	int number_of_seconds = atoi(argv[2]);

//	int *ptr = 0;
	int tid[number_of_threads];
	lock_holder = (struct spin_lock_t*)malloc(sizeof(struct spin_lock_t));
	lock_holder->lock = 0;
	queue = (int *) malloc (sizeof(int)*number_of_threads);
	int i;

	pthread_t thread[number_of_threads];
	cs_count = (int *) malloc (number_of_threads*sizeof(int));

	for(i=0;i<number_of_threads;i++){
		
		tid[i] = i;
		cs_count[i] = 0;
		pthread_create(&thread[i],NULL,thread_function,&tid[i]);
	}

	usleep(number_of_seconds*1000000);

	for(i=0;i<number_of_threads;i++) {

		printf("thread: %d\n",i);
		printf("# of critical sections entered : %d\n",cs_count[i]);
	}

	exit(3);
}
	
