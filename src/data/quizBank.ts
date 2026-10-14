import { QuizQuestion, Flashcard, TopicMastery, AptitudeQuestion } from '../types';

export const COMPREHENSIVE_QUIZ_BANK: QuizQuestion[] = [
  // DBMS
  {
    id: 'Q-DBMS-01',
    subject: 'DBMS',
    topic: 'Indexing & B+ Trees',
    question: 'Why are B+ trees preferred over binary search trees for disk-based relational databases?',
    options: [
      'B+ trees use less random access memory (RAM)',
      'High branching factor minimizes disk page read I/O operations',
      'Binary search trees cannot store string data types',
      'B+ trees do not require key balancing'
    ],
    correctIndex: 1,
    explanation: 'Disks read data in pages (blocks). A high fan-out B+ tree keeps tree height very low (3-4 levels), minimizing slow disk seeks.',
    difficulty: 'intermediate'
  },
  {
    id: 'Q-DBMS-02',
    subject: 'DBMS',
    topic: 'Normalization & Dependencies',
    question: 'Which normal form guarantees the elimination of all transitive functional dependencies?',
    options: [
      'First Normal Form (1NF)',
      'Second Normal Form (2NF)',
      'Third Normal Form (3NF)',
      'Boyce-Codd Normal Form (BCNF)'
    ],
    correctIndex: 2,
    explanation: '3NF requires that the relation is in 2NF and no non-prime attribute is transitively dependent on the primary key.',
    difficulty: 'beginner'
  },
  {
    id: 'Q-DBMS-03',
    subject: 'DBMS',
    topic: 'Transactions & ACID',
    question: 'In the ACID model, which property ensures that database modifications of committed transactions persist even during power loss?',
    options: [
      'Atomicity',
      'Consistency',
      'Isolation',
      'Durability'
    ],
    correctIndex: 3,
    explanation: 'Durability ensures that once a transaction commits, its writes are recorded in non-volatile storage (WAL) and survive system crashes.',
    difficulty: 'beginner'
  },
  {
    id: 'Q-DBMS-04',
    subject: 'DBMS',
    topic: 'Concurrency & Deadlocks',
    question: 'In Two-Phase Locking (2PL), when does the shrinking phase begin?',
    options: [
      'When the first lock is acquired',
      'When the first lock is released',
      'When the transaction commits',
      'When deadlock is detected'
    ],
    correctIndex: 1,
    explanation: 'Under 2PL, a transaction cannot acquire any new lock once it releases its first lock (entering the shrinking phase).',
    difficulty: 'advanced'
  },

  // DSA
  {
    id: 'Q-DSA-01',
    subject: 'DSA',
    topic: 'Dynamic Programming',
    question: 'What is the time complexity of solving the 0/1 Knapsack problem with N items and maximum weight W using dynamic programming?',
    options: [
      'O(N log N)',
      'O(2^N)',
      'O(N * W)',
      'O(N + W)'
    ],
    correctIndex: 2,
    explanation: 'The standard 2D tabulation matrix is of size (N+1) x (W+1), filled iteratively in O(N * W) pseudo-polynomial time.',
    difficulty: 'intermediate'
  },
  {
    id: 'Q-DSA-02',
    subject: 'DSA',
    topic: 'Binary Search Trees & Balancing',
    question: 'What is the worst-case lookup time complexity in a standard unbalanced Binary Search Tree (BST)?',
    options: [
      'O(1)',
      'O(log N)',
      'O(N)',
      'O(N log N)'
    ],
    correctIndex: 2,
    explanation: 'If keys are inserted in sorted order, the BST degenerates into a skewed linear linked list with O(N) traversal time.',
    difficulty: 'beginner'
  },
  {
    id: 'Q-DSA-03',
    subject: 'DSA',
    topic: 'Graph Algorithms',
    question: 'Which algorithm finds single-source shortest paths in a directed graph containing negative edge weights but no negative cycles?',
    options: [
      'Dijkstra\'s Algorithm',
      'Bellman-Ford Algorithm',
      'Kruskal\'s Algorithm',
      'Floyd-Warshall Algorithm'
    ],
    correctIndex: 1,
    explanation: 'Bellman-Ford relaxes all edges V-1 times and can safely detect and handle negative edge weights, unlike Dijkstra\'s greedy approach.',
    difficulty: 'intermediate'
  },
  {
    id: 'Q-DSA-04',
    subject: 'DSA',
    topic: 'Heaps & Priority Queues',
    question: 'Building a binary heap from an unsorted array of N elements using the bottom-up Heapify approach takes:',
    options: [
      'O(N log N) time',
      'O(N) time',
      'O(N^2) time',
      'O(log N) time'
    ],
    correctIndex: 1,
    explanation: 'Because lower levels have exponentially more nodes but smaller sub-tree heights, the mathematical summation converges to linear O(N) time.',
    difficulty: 'advanced'
  },

  // Operating Systems
  {
    id: 'Q-OS-01',
    subject: 'Operating Systems',
    topic: 'Virtual Memory & Paging',
    question: 'Which page replacement algorithm is strictly immune to Belady\'s Anomaly?',
    options: [
      'First-In First-Out (FIFO)',
      'Least Recently Used (LRU)',
      'Random Selection',
      'Second-Chance Clock'
    ],
    correctIndex: 1,
    explanation: 'LRU is a stack algorithm where frames allocated for size N are always a subset of frames allocated for size N+1.',
    difficulty: 'intermediate'
  },
  {
    id: 'Q-OS-02',
    subject: 'Operating Systems',
    topic: 'CPU Scheduling & Synchronization',
    question: 'Which condition is NOT one of the four necessary Coffman conditions for a deadlock to occur?',
    options: [
      'Mutual Exclusion',
      'Hold and Wait',
      'Preemptive Resource Deallocation',
      'Circular Wait'
    ],
    correctIndex: 2,
    explanation: 'No preemption is the condition. If preemptive deallocation is allowed, deadlock cannot be sustained.',
    difficulty: 'beginner'
  },

  // Computer Networks
  {
    id: 'Q-CN-01',
    subject: 'Computer Networks',
    topic: 'TCP/IP Protocol Suite',
    question: 'How many packets are exchanged to complete the standard TCP 3-way connection establishment handshake?',
    options: [
      '2 packets (SYN, ACK)',
      '3 packets (SYN, SYN-ACK, ACK)',
      '4 packets (SYN, ACK, DATA, FIN)',
      '1 broadcast packet'
    ],
    correctIndex: 1,
    explanation: 'Client sends SYN, Server replies with SYN-ACK, and Client confirms with ACK before connection moves to ESTABLISHED.',
    difficulty: 'beginner'
  },
  {
    id: 'Q-CN-02',
    subject: 'Computer Networks',
    topic: 'Subnetting & Routing',
    question: 'What is the network address for an IP 192.168.1.135 with subnet mask /26 (255.255.255.192)?',
    options: [
      '192.168.1.0',
      '192.168.1.64',
      '192.168.1.128',
      '192.168.1.192'
    ],
    correctIndex: 2,
    explanation: 'In the 4th octet, 135 AND 192 = 128. The subnet blocks increment by 64 (0, 64, 128, 192).',
    difficulty: 'intermediate'
  },

  // Java
  {
    id: 'Q-JAVA-01',
    subject: 'Java',
    topic: 'JVM Architecture & Memory Generations',
    question: 'In the HotSpot JVM, where are newly instantiated objects initially allocated before surviving garbage collection cycles?',
    options: [
      'Tenured (Old) Generation',
      'Metaspace / Method Area',
      'Eden Space in the Young Generation',
      'Thread Execution Stack Frame'
    ],
    correctIndex: 2,
    explanation: 'All new objects start in the Young Generation Eden space. Objects that survive Minor GC cycles are cycled between Survivor spaces S0/S1 before promotion to Tenured Old Gen.',
    difficulty: 'intermediate'
  },
  {
    id: 'Q-JAVA-02',
    subject: 'Java',
    topic: 'Object-Oriented Design & Interfaces',
    question: 'Which of the following is true regarding Java Interfaces versus Abstract Classes (Java 8+)?',
    options: [
      'A class can implement only one interface but extend multiple abstract classes',
      'Interfaces can provide default method implementations but cannot hold mutable instance state',
      'Abstract classes cannot have constructor methods',
      'Interfaces cannot define static utility methods'
    ],
    correctIndex: 1,
    explanation: 'Java 8+ allows default and static methods in interfaces, but interfaces cannot hold instance variables (state), whereas abstract classes can have constructors and mutable fields.',
    difficulty: 'beginner'
  },
  {
    id: 'Q-JAVA-03',
    subject: 'Java',
    topic: 'Concurrency & Memory Model (JMM)',
    question: 'In the Java Memory Model, what guarantee does the volatile keyword provide on a shared variable?',
    options: [
      'It guarantees atomic compound operations like counter++',
      'It prevents thread context switching completely',
      'It enforces visibility across CPU caches and prevents instruction reordering around reads/writes',
      'It locks the entire class for exclusive thread access'
    ],
    correctIndex: 2,
    explanation: 'Volatile establishes a "Happens-Before" relationship, flushing CPU store buffers and preventing compiler instruction reordering, but does NOT guarantee atomicity for compound operations.',
    difficulty: 'advanced'
  },

  // Python
  {
    id: 'Q-PY-01',
    subject: 'Python',
    topic: 'Memory Management & Reference Counting',
    question: 'Why does CPython require a cyclical garbage collector alongside its primary reference counting mechanism?',
    options: [
      'Reference counting is too slow for single-threaded scripts',
      'Reference counts can never reach zero for circular reference cycles',
      'Python integers cannot be tracked with reference counters',
      'Reference counting only works on 32-bit operating systems'
    ],
    correctIndex: 1,
    explanation: 'If object A refers to B and B refers to A, both reference counts remain at least 1 even when disconnected from global scope. Generational GC detects and breaks these isolated cycles.',
    difficulty: 'intermediate'
  },
  {
    id: 'Q-PY-02',
    subject: 'Python',
    topic: 'Generators & Iterators',
    question: 'What is the primary architectural advantage of using a generator with yield instead of returning a materialized list?',
    options: [
      'Generators execute in C rather than Python bytecode',
      'Generators evaluate lazily on-demand, consuming O(1) auxiliary memory regardless of sequence size',
      'Generators bypass Python type checking completely',
      'Generators automatically parallelize across multiple CPU cores'
    ],
    correctIndex: 1,
    explanation: 'Generators yield one item at a time lazily, avoiding the allocation of giant arrays in RAM for large-scale data streams.',
    difficulty: 'beginner'
  },
  {
    id: 'Q-PY-03',
    subject: 'Python',
    topic: 'Global Interpreter Lock (GIL)',
    question: 'What is the impact of the CPython Global Interpreter Lock (GIL) on multi-threaded programs?',
    options: [
      'It prevents multi-threading on I/O-bound network calls',
      'It prevents multiple native CPU threads from executing Python bytecodes concurrently on multi-core systems',
      'It forces all functions to be written as pure async functions',
      'It disables dynamic memory allocation during loops'
    ],
    correctIndex: 1,
    explanation: 'The GIL is a mutex protecting internal CPython memory state. For CPU-bound tasks, only one thread runs bytecode at a time; multiprocessing or native C extensions are required for true multi-core parallel computation.',
    difficulty: 'advanced'
  },

  // Mathematics
  {
    id: 'Q-MATH-01',
    subject: 'Mathematics',
    topic: 'Probability & Bayes Theorem',
    question: 'Bayes Theorem states P(A|B) = [P(B|A) * P(A)] / P(B). In this equation, what does P(A|B) represent?',
    options: [
      'Prior probability of A before evidence B is observed',
      'Posterior probability of hypothesis A given that evidence B occurred',
      'Likelihood of observing evidence B independent of A',
      'Marginal probability of independent event B'
    ],
    correctIndex: 1,
    explanation: 'P(A|B) is the posterior probability: the updated belief in hypothesis A after taking observed evidence B into account.',
    difficulty: 'intermediate'
  },
  {
    id: 'Q-MATH-02',
    subject: 'Mathematics',
    topic: 'Discrete Mathematics & Propositional Logic',
    question: 'According to De Morgan\'s Laws in boolean propositional logic, what is the equivalent of NOT (P AND Q)?',
    options: [
      '(NOT P) AND (NOT Q)',
      '(NOT P) OR (NOT Q)',
      'P OR Q',
      'NOT P OR Q'
    ],
    correctIndex: 1,
    explanation: 'De Morgan\'s Law states ¬(P ∧ Q) ≡ (¬P) ∨ (¬Q). The negation of a conjunction is the disjunction of the negations.',
    difficulty: 'beginner'
  },
  {
    id: 'Q-MATH-03',
    subject: 'Mathematics',
    topic: 'Graph Theory & Eulerian Circuits',
    question: 'What degree property is required for a connected undirected graph to contain an Eulerian Circuit (a closed trail visiting every edge exactly once)?',
    options: [
      'Every vertex must have an even degree',
      'Exactly two vertices must have an odd degree',
      'The graph must be a tree with V-1 edges',
      'All vertex degrees must be prime numbers'
    ],
    correctIndex: 0,
    explanation: 'Euler proved that a connected graph contains an Eulerian Circuit if and only if EVERY vertex has an even degree (so every entry into a vertex has a matching departure edge).',
    difficulty: 'advanced'
  }
];

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'FC-001',
    subject: 'DBMS',
    topic: 'Indexing & B+ Trees',
    front: 'Why do B+ trees keep data pointers exclusively in leaf nodes?',
    back: 'By storing only search keys in internal nodes, node capacity (fan-out) is maximized. This keeps the tree height shallow (3-4 disk seeks max) and enables leaf node range scanning via linked lists.',
    mastery: 'mastered',
    lastReviewed: '2 days ago'
  },
  {
    id: 'FC-002',
    subject: 'DSA',
    topic: 'Dynamic Programming',
    front: 'What are the two mandatory prerequisites for applying Dynamic Programming?',
    back: '1. Overlapping Subproblems (subproblems recur repeatedly rather than generating new ones).\n2. Optimal Substructure (optimal global solution is composed of optimal solutions to its subproblems).',
    mastery: 'needs_revision',
    lastReviewed: 'Yesterday'
  },
  {
    id: 'FC-003',
    subject: 'Operating Systems',
    topic: 'Virtual Memory & Paging',
    front: 'What is Belady\'s Anomaly and which algorithm exhibits it?',
    back: 'Belady\'s Anomaly is when increasing the number of physical frame allocations results in MORE page faults instead of fewer. It frequently occurs in FIFO page replacement.',
    mastery: 'learning',
    lastReviewed: '3 days ago'
  },
  {
    id: 'FC-004',
    subject: 'Computer Networks',
    topic: 'TCP/IP',
    front: 'What is the purpose of the TIME_WAIT state in TCP teardown?',
    back: 'TIME_WAIT allows the final ACK to reach the remote peer (in case it was dropped in transit) and ensures old duplicate segments from the connection expire in the network (2 * MSL).',
    mastery: 'mastered',
    lastReviewed: '4 days ago'
  },
  {
    id: 'FC-005',
    subject: 'DSA',
    topic: 'Graph Algorithms',
    front: 'When does Dijkstra\'s shortest path algorithm fail?',
    back: 'Dijkstra fails when the graph contains negative edge weights because its greedy assumption (that visited nodes have reached their final minimal distance) is invalidated.',
    mastery: 'needs_revision',
    lastReviewed: 'Yesterday'
  },
  {
    id: 'FC-006',
    subject: 'Java',
    topic: 'JVM Architecture',
    front: 'What is the role of the JIT (Just-In-Time) compiler in the JVM?',
    back: 'The JIT compiles frequently executed bytecode (hot spots) into native machine instructions at runtime, applying method inlining, escape analysis, and loop unrolling for near-C++ execution speed.',
    mastery: 'mastered',
    lastReviewed: '3 days ago'
  },
  {
    id: 'FC-007',
    subject: 'Python',
    topic: 'Memory Management',
    front: 'Why does Python combine Reference Counting with Generational Garbage Collection?',
    back: 'Reference counting instantly reclaims memory when counts reach zero. Generational GC runs periodically across 3 generations to detect and break isolated circular reference cycles that reference counting alone cannot resolve.',
    mastery: 'learning',
    lastReviewed: '2 days ago'
  },
  {
    id: 'FC-008',
    subject: 'Mathematics',
    topic: 'Probability & Bayes Theorem',
    front: 'Write Bayes Theorem formula and define its four core components.',
    back: 'P(A|B) = [P(B|A) * P(A)] / P(B).\nP(A|B) is the Posterior, P(B|A) is the Likelihood, P(A) is the Prior probability of hypothesis A, and P(B) is the Marginal evidence probability.',
    mastery: 'needs_revision',
    lastReviewed: 'Today'
  }
];

export const INITIAL_TOPIC_MASTERIES: TopicMastery[] = [
  {
    subject: 'DBMS',
    topic: 'Indexing & B+ Trees',
    masteryPercentage: 88,
    quizzesTaken: 4,
    lastPracticed: 'Oct 10, 2026',
    status: 'mastered'
  },
  {
    subject: 'Operating Systems',
    topic: 'Virtual Memory & Paging',
    masteryPercentage: 72,
    quizzesTaken: 3,
    lastPracticed: 'Oct 09, 2026',
    status: 'proficient'
  },
  {
    subject: 'DSA',
    topic: 'Dynamic Programming',
    masteryPercentage: 42,
    quizzesTaken: 5,
    lastPracticed: 'Oct 11, 2026',
    status: 'needs_revision'
  },
  {
    subject: 'DSA',
    topic: 'Graph Traversal & Shortest Paths',
    masteryPercentage: 48,
    quizzesTaken: 2,
    lastPracticed: 'Oct 08, 2026',
    status: 'needs_revision'
  },
  {
    subject: 'Computer Networks',
    topic: 'TCP 3-Way Handshake & Congestion Control',
    masteryPercentage: 80,
    quizzesTaken: 3,
    lastPracticed: 'Oct 07, 2026',
    status: 'mastered'
  },
  {
    subject: 'Java',
    topic: 'JVM Architecture & Concurrency',
    masteryPercentage: 85,
    quizzesTaken: 3,
    lastPracticed: 'Oct 11, 2026',
    status: 'mastered'
  },
  {
    subject: 'Python',
    topic: 'Generators & Memory Model',
    masteryPercentage: 78,
    quizzesTaken: 2,
    lastPracticed: 'Oct 10, 2026',
    status: 'proficient'
  },
  {
    subject: 'Mathematics',
    topic: 'Bayes Theorem & Graph Theory',
    masteryPercentage: 55,
    quizzesTaken: 2,
    lastPracticed: 'Oct 12, 2026',
    status: 'needs_revision'
  }
];

export const APTITUDE_QUESTION_BANK: AptitudeQuestion[] = [
  {
    id: 'APT-001',
    category: 'quantitative',
    topic: 'Time and Work',
    question: 'Pipe A can fill a tank in 6 hours, and Pipe B can fill it in 8 hours. If both pipes are opened together, how long will it take to fill the tank?',
    options: [
      '3 hours 25 minutes',
      '3 hours 26 minutes (24/7 hours)',
      '4 hours 10 minutes',
      '3 hours 45 minutes'
    ],
    correctIndex: 1,
    solution: 'Combined rate = (1/6 + 1/8) = (4+3)/24 = 7/24 tank per hour. Total time = 24/7 hours = 3 hours and 25.7 minutes (~3h 26m).'
  },
  {
    id: 'APT-002',
    category: 'logical',
    topic: 'Blood Relations & Deductions',
    question: 'Pointing to a photograph of a boy, Suresh said, "He is the son of the only son of my mother." How is Suresh related to that boy?',
    options: [
      'Brother',
      'Uncle',
      'Father',
      'Cousin'
    ],
    correctIndex: 2,
    solution: '"Only son of my mother" refers to Suresh himself. Therefore, the boy in the photograph is Suresh\'s son, making Suresh the Father.'
  },
  {
    id: 'APT-003',
    category: 'verbal',
    topic: 'Critical Reasoning',
    question: 'Identify the grammatically correct sentence with proper subject-verb agreement:',
    options: [
      'Neither the professor nor the students was present in the lab.',
      'Neither the professor nor the students were present in the lab.',
      'Neither the professor or the students was present in the lab.',
      'Neither the professor and the students were present in the lab.'
    ],
    correctIndex: 1,
    solution: 'In "neither...nor" constructions, the verb agrees in number with the closer subject ("students" -> plural "were").'
  }
];
