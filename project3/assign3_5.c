#include<stdio.h>
#include<unistd.h>
#include<stdlib.h>
#include<pthread.h>
#include<assert.h>
#include<stdbool.h>

int *count;
int num_threads;
volatile int in_cs = 0;

void mfence (void) {
  asm volatile ("mfence" : : : "memory");
}

static inline int atomic_xadd (volatile int *ptr)
{
  register int val __asm__("eax") = 1;
  asm volatile ("lock xaddl %0,%1"
  : "+r" (val)
  : "m" (*ptr)
  : "memory"
  );  
  return val;
}

struct spin_lock_t{
	int curr_tid;
	int next_tid;
};

struct spin_lock_t *s_lock;

void spin_lock(struct spin_lock_t *s,int x)
{
	while(x != s->curr_tid){};
}

void spin_unlock(struct spin_lock_t *s)
{
	if(num_threads-1 <= s->curr_tid)
	{
		s->curr_tid = 0;
		s->next_tid = 1;
	}
	else
	{
		atomic_xadd(&s->curr_tid);
	}
}




void *thread_func(void *arg)
{
	int *i = (int *)arg;
	pthread_detach(pthread_self());
		
	while(true)
	{
	//Spin waiting for the lock
	spin_lock(s_lock,*i);

	//Critical section
	count[*i]+=1;
	assert(in_cs == 0);
	in_cs++;
	assert(in_cs == 1);
	in_cs++;
	assert(in_cs == 2);
	in_cs++;
	assert(in_cs == 3);
	in_cs = 0;
	
	//Unlocking
	spin_unlock(s_lock);
	}
}

int main(int argc, char * argv[])
{

	if(argc!=3){

		printf("Please enter two inputs\n");
		return EXIT_FAILURE;
	}

	int val;
	s_lock = (struct spin_lock_t*)malloc(sizeof(struct spin_lock_t));
	s_lock->curr_tid = 0;
	s_lock->next_tid = 1;
	num_threads = atoi(argv[1]);
	int time_to_exec = atoi(argv[2]);
	pthread_t thread[num_threads];
	int tid[num_threads];
	count = (int *)malloc(sizeof(int)*num_threads);
	int i = 0;
	
	if (s_lock == NULL || count == NULL ){

		printf("Malloc failed, exiting...\n");
		return EXIT_FAILURE;

	}

	for( i = 0 ; i < num_threads ; i++ )
	{
		count[i] = 0;
		tid[i] = i;
		if((val = pthread_create(&thread[i],NULL,thread_func,&tid[i]))) {
			fprintf(stderr,"error: In creating the thread, rc : %d\n",val);
			return EXIT_FAILURE;
  		}
	}

	usleep(time_to_exec*1000000);

	for( i = 0 ; i < num_threads ; i++ )
 	{

		pthread_join(thread[i],NULL);
		printf("\nThread : %d enetered CS %d times\n",i,count[i]);
	}	

	return EXIT_SUCCESS;
}
