import { TutorMessage, TutorMode, TutorLevel } from '../types';

interface SubjectTopicKnowledge {
  keywords: string[];
  title: string;
  beginner: {
    explanation: string;
    analogy: string;
    example: string;
  };
  intermediate: {
    explanation: string;
    breakdown: string[];
    code?: { language: string; code: string; explanation: string };
  };
  advanced: {
    explanation: string;
    internalMechanics: string[];
    complexityAnalysis?: string;
    tradeoffs: string;
  };
  examTips: string[];
  careerRelevance: string;
  miniQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

const KNOWLEDGE_BASE: Record<string, SubjectTopicKnowledge> = {
  // 1. DBMS - B+ Trees & Indexing
  'indexing': {
    keywords: ['index', 'b+ tree', 'b tree', 'clustering', 'dbms', 'database', 'query optimization'],
    title: 'Database Indexing & B+ Trees',
    beginner: {
      explanation: 'Think of an index in a database exactly like the index section at the back of a 1,000-page textbook. Instead of reading every single page to find "Normalization", you look at the alphabetical index, jump directly to page 412, and save 99% of your time.',
      analogy: 'Without an index, the database conducts a "Full Table Scan" (reading all rows from disk). With an index, it performs a logarithmic lookup.',
      example: 'Searching 1,000,000 student records: Full Scan takes ~1,000,000 disk page checks. A B+ Tree index with depth 3 takes only 3 to 4 disk page lookups.'
    },
    intermediate: {
      explanation: 'A B+ Tree is an N-ary balanced search tree where all data records/pointers are stored exclusively in the leaf nodes, while internal nodes store only routing keys and page pointers.',
      breakdown: [
        'Balanced Height: All leaf nodes reside at the exact same depth, guaranteeing O(log N) lookup, insertion, and deletion.',
        'High Fan-Out: Each node holds hundreds of keys (typically matching an OS disk page size, e.g., 4KB or 8KB).',
        'Linked Leaves: Leaf nodes are connected via a doubly-linked list, making range queries (e.g., `BETWEEN 70 AND 90`) extraordinarily fast.'
      ],
      code: {
        language: 'sql',
        code: `-- Creating a composite index for fast filtering on department and CGPA
CREATE INDEX idx_student_dept_cgpa 
ON students (department, cgpa DESC);

-- Query execution plan uses Index Range Scan instead of Sequential Scan:
EXPLAIN SELECT student_id, name FROM students 
WHERE department = 'Computer Science' AND cgpa >= 8.5;`,
        explanation: 'The composite B+ Tree index allows binary traversal on department, then sequential scanning along the leaf chain for CGPA >= 8.5.'
      }
    },
    advanced: {
      explanation: 'In high-concurrency production storage engines (like InnoDB or RocksDB), B+ Trees utilize write-ahead logging (WAL) and latch crabbing to handle concurrent reader and writer threads safely without full tree locking.',
      internalMechanics: [
        'Latch Crabbing (Coupling): To traverse down, the thread locks child node before releasing the parent latch. If no split/merge is needed, parent latches are freed early.',
        'Node Splitting: When an insertion overflows node capacity M, it splits into two nodes of size M/2 and propagates a middle key upwards.',
        'Buffer Pool Impact: Dirty pages are buffered in RAM and lazily flushed by checkpoint threads to prevent synchronous disk I/O bottlenecks.'
      ],
      complexityAnalysis: 'Time: Search O(log_B N), Insert O(log_B N), Range Scan O(log_B N + K/B) where B is branching factor. Space: O(N).',
      tradeoffs: 'Indexes drastically accelerate SELECT read queries, but impose write amplification overhead on INSERT, UPDATE, and DELETE operations.'
    },
    examTips: [
      'High-yield 10-mark question: "Differentiate between B-Tree and B+ Tree with structural diagrams."',
      'Key point for exams: In B+ Trees, data pointers exist ONLY in leaf nodes. In B-Trees, data pointers can reside in non-leaf internal nodes.',
      'Always mention the doubly-linked list linking leaf nodes for efficient range scanning.'
    ],
    careerRelevance: 'Interviewers at Amazon, Google, and Oracle frequently ask about B+ Trees vs LSM Trees when designing scalable storage engines and optimizing SQL query execution plans.',
    miniQuiz: {
      question: 'Why are B+ Trees preferred over binary search trees for relational database indexes?',
      options: [
        'B+ Trees occupy less RAM memory',
        'High branching factor minimizes disk page I/O transfers',
        'B+ Trees only support string data types',
        'Binary search trees cannot store duplicate keys'
      ],
      correctIndex: 1,
      explanation: 'Disks read data in blocks (pages). A high fan-out (branching factor) B+ Tree keeps the tree height low (3-4 levels), minimizing costly disk I/O seek operations.'
    }
  },

  // 2. DSA - Dynamic Programming (Knapsack & Subproblems)
  'dynamic programming': {
    keywords: ['dp', 'dynamic programming', 'knapsack', 'memoization', 'tabulation', 'recursion', 'dsa'],
    title: 'Dynamic Programming: Optimal Substructure & Overlapping Subproblems',
    beginner: {
      explanation: 'Dynamic Programming is essentially "remembering your past work so you do not solve the same subproblem twice". Write down 1+1+1+1+1 on a board. How many 1s? Five. Now add another "+ 1" to the end. How many now? Six! You didn\'t recount the first five—you remembered "5" and added 1.',
      analogy: 'Imagine taking notes on solved math problems. If the exact same equation appears again on page 10, you look up your past answer in O(1) instead of recalculating for 10 minutes.',
      example: 'Fibonacci: Calculating Fib(5) recursively computes Fib(2) three separate times. DP caches Fib(2) upon first calculation, turning O(2^N) exponential time into O(N) linear time.'
    },
    intermediate: {
      explanation: 'Dynamic programming applies when a problem exhibits two critical properties: (1) Overlapping Subproblems, and (2) Optimal Substructure (the optimal solution of the master problem is constructed from optimal solutions of subproblems).',
      breakdown: [
        'Top-Down with Memoization: Start from the target state and recursively break down, storing results in a hash map or array.',
        'Bottom-Up Tabulation: Initialize base cases and iteratively fill an iterative DP table from smallest subproblems up to the target state.',
        'State Definition: Clearly define what dp[i] or dp[i][w] represents (e.g., maximum profit considering first i items with weight limit w).'
      ],
      code: {
        language: 'python',
        code: `def knapsack_01(weights, values, capacity):
    n = len(weights)
    # dp[i][w] = max value using a subset of first i items with weight capacity w
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i - 1] <= w:
                # Max of: excluding item OR including item
                dp[i][w] = max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]])
            else:
                dp[i][w] = dp[i - 1][w]
                
    return dp[n][capacity]`,
        explanation: '0/1 Knapsack tabular bottom-up solution running in O(N * W) pseudo-polynomial time and O(N * W) space.'
      }
    },
    advanced: {
      explanation: 'In competitive programming and technical interviews, space optimization reduces 2D tables to 1D sliding rolling arrays when dp[i] only depends on row dp[i-1].',
      internalMechanics: [
        'Space Optimization: By iterating the capacity loop backwards from W down to weight[i], we can maintain a single 1D array of size W+1.',
        'Bitmask DP: Representing subset states as bit vectors of length N for TSP or assignment problems (O(2^N * N)).',
        'Divide and Conquer Optimization: Applicable when recurrence satisfies the Monge property or quadrangle inequality.'
      ],
      complexityAnalysis: 'Time: O(N * W), Space: Optimized from O(N * W) to O(W) with 1D reverse iteration.',
      tradeoffs: 'Top-down is easier to write and only computes reachable states; bottom-up eliminates recursion call stack overhead and enables cache-friendly contiguous array traversals.'
    },
    examTips: [
      'Frequent 8-mark question: "Write the recurrence relation and pseudo-code for 0/1 Knapsack."',
      'Make sure to write the mathematical recurrence explicitly: dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w-wt[i-1]]).',
      'Explain the difference between Memoization (Top-down) and Tabulation (Bottom-up).'
    ],
    careerRelevance: 'DP is tested in over 65% of FAANG/Tier-1 software engineer technical coding rounds (e.g. Longest Common Subsequence, Coin Change, Edit Distance).',
    miniQuiz: {
      question: 'What happens to the 0/1 Knapsack recurrence if an item can be chosen infinitely many times?',
      options: [
        'It becomes Unbounded Knapsack and checks dp[i][w - wt[i-1]] instead of dp[i-1][w - wt[i-1]]',
        'The problem becomes unsolvable in polynomial time',
        'It reduces to fractional knapsack and is solved greedily',
        'The time complexity increases to O(N!)'
      ],
      correctIndex: 0,
      explanation: 'In Unbounded Knapsack, since the same item i can be reused, the subproblem state transitions from dp[i] rather than dp[i-1].'
    }
  },

  // 3. Operating Systems - Virtual Memory & Page Replacement
  'operating systems': {
    keywords: ['virtual memory', 'paging', 'page fault', 'tlb', 'operating systems', 'os', 'deadlock', 'process'],
    title: 'Operating Systems: Virtual Memory & Page Replacement',
    beginner: {
      explanation: 'Imagine your desk only fits 3 books at a time, but your semester has 10 textbooks. You keep the 3 books you are currently reading on your desk (RAM) and keep the other 7 on the bookshelf in the corner (Hard Drive / Swap). When you need chapter 4 of a book on the shelf, you put an unread book back and fetch the new one. That fetch is a "Page Fault".',
      analogy: 'Virtual memory gives every program the illusion of having a vast, contiguous address space (e.g. 4GB or 128TB), even if the computer only has 8GB of physical RAM shared across 50 applications.',
      example: 'When Chrome uses 6GB of memory while playing a game, the OS transparently pages out inactive background tabs to the SSD disk swap space.'
    },
    intermediate: {
      explanation: 'Virtual addresses generated by the CPU are mapped to physical RAM frames by the hardware Memory Management Unit (MMU) using multi-level page tables and a Translation Lookaside Buffer (TLB) cache.',
      breakdown: [
        'Paging: Virtual address space is divided into fixed-size chunks called pages (typically 4KB). Physical memory is divided into frames.',
        'TLB (Translation Lookaside Buffer): High-speed hardware cache that stores recent virtual-to-physical address translations.',
        'Page Fault: Hardware interrupt triggered when a requested virtual page is not currently mapped into physical RAM (valid bit = 0).'
      ],
      code: {
        language: 'text',
        code: `CPU Virtual Address -> [ Virtual Page Number (VPN) | Page Offset ]
                          |
                   [ Check TLB Cache ]
                   /                 \\
            TLB Hit (1-2ns)      TLB Miss
                 |                   |
            Frame Address     [ Page Table Walk in RAM ]
                                     |
                          [ Page in RAM? (Valid bit) ]
                          /                         \\
                     Yes (Page Hit)            No (Page Fault)
                          |                         |
                    Update TLB            Trap to OS Kernel
                                          Fetch Page from SSD
                                          Apply LRU Replacement`,
        explanation: 'Hardware translation pipeline with TLB caching and kernel page-fault trap handling.'
      }
    },
    advanced: {
      explanation: 'Page replacement algorithms (LRU, Clock/Second-Chance, Working Set Model) determine which physical frame to evict upon a page fault. Thrashing occurs when the sum of working sets exceeds available physical frames.',
      internalMechanics: [
        'Belady\'s Anomaly: FIFO page replacement can exhibit more page faults when allocated more physical frames. LRU is an optimal stack algorithm immune to Belady\'s Anomaly.',
        'Clock / Second Chance: Uses a reference bit; pointer sweeps frames, clearing bit 1 to 0; evicts first frame with bit 0.',
        'Copy-On-Write (COW): When fork() is called, parent and child share read-only pages. A frame is duplicated only when one process attempts a write.'
      ],
      complexityAnalysis: 'LRU precise tracking: O(1) with Doubly-Linked List + Hash Map; OS kernels approximate LRU using Clock algorithm hardware reference bits.',
      tradeoffs: 'Fine-grained page sizes reduce internal fragmentation but balloon page table memory footprint; HugePages (2MB/1GB) accelerate high-memory database workloads by drastically reducing TLB misses.'
    },
    examTips: [
      'High-yield 10-mark question: "Solve a numerical problem calculating Page Faults for FIFO, LRU, and Optimal on a given reference string with 3 frames."',
      'Define Belady\'s Anomaly with a concrete reference string example (e.g. 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5).',
      'Explain the purpose of the Dirty/Modified bit to avoid redundant disk writes during page eviction.'
    ],
    careerRelevance: 'Virtual memory fundamentals are crucial in Systems Engineering, Cloud DevOps (understanding OOM Killer, swap thrashing), and Senior Backend interviews.',
    miniQuiz: {
      question: 'Which page replacement algorithm is immune to Belady\'s Anomaly?',
      options: [
        'First-In First-Out (FIFO)',
        'Least Recently Used (LRU)',
        'Random Replacement',
        'Second-Chance Algorithm'
      ],
      correctIndex: 1,
      explanation: 'LRU belongs to the class of "stack algorithms" where the set of pages in memory for n frames is always a subset of the pages in memory for n+1 frames, preventing Belady\'s Anomaly.'
    }
  },

  // 4. Computer Networks - TCP Handshake & Congestion Control
  'computer networks': {
    keywords: ['tcp', 'udp', 'handshake', 'osi', 'congestion control', 'computer networks', 'networking', 'ip'],
    title: 'Computer Networks: TCP 3-Way Handshake & Reliability',
    beginner: {
      explanation: 'TCP is like a recorded, registered postal letter with delivery receipts, whereas UDP is like throwing flyers out of a moving car. With TCP, before any message is sent, both sides shake hands: "Can you hear me?", "Yes, I hear you, can you hear me?", "Yes, loud and clear! Let\'s talk."',
      analogy: 'The 3-Way Handshake establishes synchronized sequence numbers on both ends so lost or out-of-order packets can be detected and retransmitted accurately.',
      example: 'Downloading a banking statement uses TCP (every single byte must arrive accurately). Streaming live video sports uses UDP (dropping 1 pixel frame is fine, but pausing to retransmit destroys the live experience).'
    },
    intermediate: {
      explanation: 'TCP establishes reliable, ordered, full-duplex byte streams over unreliable IP networks using sequence numbers, acknowledgments, sliding windows, and timeout retransmissions.',
      breakdown: [
        'Step 1 (SYN): Client sends SYN packet with Initial Sequence Number (ISN_c). State: SYN_SENT.',
        'Step 2 (SYN-ACK): Server responds with SYN flag, its own ISN_s, and ACK = ISN_c + 1. State: SYN_RCVD.',
        'Step 3 (ACK): Client acknowledges with ACK = ISN_s + 1. Connection moves to ESTABLISHED state.'
      ],
      code: {
        language: 'text',
        code: `Client                                 Server
  |                                       |
  | -------- SYN (Seq=X) ---------------> |  (Client enters SYN_SENT)
  |                                       |  (Server enters SYN_RCVD)
  | <------- SYN-ACK (Seq=Y, Ack=X+1) -- |  
  |                                       |
  | -------- ACK (Seq=X+1, Ack=Y+1) ----> |  (Connection ESTABLISHED)
  |                                       |
  | ======== Full-Duplex Data Flow ====== |`,
        explanation: 'The 3-way synchronization exchange ensures bidirectional sequence number agreement.'
      }
    },
    advanced: {
      explanation: 'TCP Congestion Control prevents overwhelming network routers through dynamic window sizing across 4 distinct phases: Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery.',
      internalMechanics: [
        'Congestion Window (cwnd): Tracks how many bytes can be transmitted without receiving an ACK.',
        'Slow Start: cwnd starts at 1 MSS (or 10 in modern OS) and doubles exponentially every RTT until ssthresh threshold is met.',
        'Congestion Avoidance: Once cwnd >= ssthresh, growth transitions to linear (+1 MSS per RTT).',
        'Fast Retransmit & Recovery (TCP Reno): 3 duplicate ACKs trigger immediate retransmission without waiting for retransmission timer expiration.'
      ],
      complexityAnalysis: 'Throughput bound by Bandwidth-Delay Product (BDP = Bandwidth * RTT). Max window size = 64KB unless TCP Window Scale option is enabled.',
      tradeoffs: 'TCP ensures reliability at the expense of handshake latency (1.5 RTT) and head-of-line blocking; HTTP/3 (QUIC) solves this by building streams over UDP.'
    },
    examTips: [
      'Standard 8-mark question: "Explain the TCP 3-Way Handshake and 4-Way Connection Termination with sequence diagrams."',
      'Explain SYN Flood attacks and how SYN Cookies mitigate denial-of-service without allocating memory on initial SYN.',
      'Contrast TCP flow control (Receiver Window rwnd) with congestion control (Congestion Window cwnd).'
    ],
    careerRelevance: 'Crucial for Systems Architecture, Backend Performance Engineering, Microservices networking, and Site Reliability Engineering (SRE) roles.',
    miniQuiz: {
      question: 'What triggers Fast Retransmit in standard TCP Reno without waiting for the retransmission timer to expire?',
      options: [
        'Receipt of 3 duplicate ACKs',
        'Timeout on the sender queue',
        'SYN packet expiration',
        'RST flag received from gateway'
      ],
      correctIndex: 0,
      explanation: 'When the receiver gets out-of-order packets, it repeatedly ACKs the last in-order byte. 3 duplicate ACKs signal to the sender that a specific packet was lost while subsequent packets arrived, triggering Fast Retransmit.'
    }
  },

  // 5. Java - JVM Architecture, Memory Model & Concurrency
  'java': {
    keywords: ['java', 'jvm', 'garbage collection', 'gc', 'polymorphism', 'inheritance', 'interface', 'abstract class', 'multithreading', 'hashmap', 'concurrent', 'jit'],
    title: 'Java: JVM Architecture, Memory Model & Object-Oriented Design',
    beginner: {
      explanation: 'Java achieves "Write Once, Run Anywhere" (WORA) by compiling your human-readable Java code (.java) into universal Bytecode (.class files). Instead of speaking directly to your specific computer hardware (Windows or Mac), the bytecode runs inside a standardized software machine called the Java Virtual Machine (JVM).',
      analogy: 'Imagine speaking French, but instead of learning 10 different foreign languages, an interpreter (JVM) translates your French into Japanese, German, or Spanish depending on who is listening.',
      example: 'In C++, allocating an object means you must remember to free it with delete. In Java, objects are allocated on the Heap and the JVM Garbage Collector automatically sweeps away unused memory in the background.'
    },
    intermediate: {
      explanation: 'The JVM runtime data area is partitioned into Method Area (metaspace for class metadata and static variables), Heap (shared instance objects), Java Thread Stacks (local variables and call frames), Program Counter (PC) Registers, and Native Method Stacks.',
      breakdown: [
        'Heap Generations: Divided into Young Generation (Eden space and two Survivor spaces S0/S1) and Old (Tenured) Generation.',
        'Minor GC vs Major GC: Minor GC cleans short-lived objects in Eden; long-lived objects surviving several cycles (tenuring threshold, default 15) are promoted to Tenured Old Gen.',
        'Interface vs Abstract Class: An interface defines contract behavior (what an object does); an abstract class shares concrete implementation state (what an object is).'
      ],
      code: {
        language: 'java',
        code: `// High-performance thread-safe singleton with Double-Checked Locking
public class ConnectionPoolManager {
    // volatile guarantees visibility across CPU thread caches
    private static volatile ConnectionPoolManager instance;
    
    private ConnectionPoolManager() {
        // Prevent reflection instantiation attack
    }
    
    public static ConnectionPoolManager getInstance() {
        if (instance == null) {
            synchronized (ConnectionPoolManager.class) {
                if (instance == null) {
                    instance = new ConnectionPoolManager();
                }
            }
        }
        return instance;
    }
}`,
        explanation: 'The volatile keyword ensures CPU memory instruction reordering does not publish a half-initialized object reference to reader threads.'
      }
    },
    advanced: {
      explanation: 'Modern production JVMs (OpenJDK HotSpot, GraalVM) utilize sophisticated JIT (Just-In-Time) compilation (Tiered Compilation: C1 client for fast startup, C2 server for aggressive escape analysis, loop unrolling, and inlining).',
      internalMechanics: [
        'Garbage Collectors: G1GC (Region-based with predictable pause-time targets), ZGC / Shenandoah (Concurrent low-latency collectors with sub-millisecond pauses via load barriers).',
        'Java Memory Model (JMM): Governs "Happens-Before" relationships, thread caches, and memory barriers (StoreLoad, LoadLoad).',
        'Object Header (Mark Word): 64-bit header on 64-bit architectures storing identity hash code, GC age bits, biased locking flags, and monitor pointers.'
      ],
      complexityAnalysis: 'HashMap get/put: O(1) average. When bucket collisions exceed TREEIFY_THRESHOLD (8), linked nodes transform into Red-Black Trees guaranteeing O(log N) worst-case.',
      tradeoffs: 'Garbage collection eliminates dangling pointers and buffer overflows, but can introduce Stop-The-World (STW) latency spikes if heap allocations exceed GC throughput capacity.'
    },
    examTips: [
      'Frequent 10-mark exam question: "Explain the JVM Architecture with a neat block diagram covering Class Loader, Runtime Data Areas, and Execution Engine."',
      'Clearly distinguish between Method Overloading (compile-time static polymorphism) and Method Overriding (runtime dynamic polymorphism with vtable).',
      'Explain the difference between StringBuffer (synchronized thread-safe) and StringBuilder (unsynchronized faster single-thread).'
    ],
    careerRelevance: 'Java core concepts (JVM tuning, GC logs, HashMap collision handling, synchronized vs ReentrantLock) form the core of Enterprise Backend and Banking / FinTech technical rounds.',
    miniQuiz: {
      question: 'In Java, when multiple keys hash to the same bucket in a HashMap (Java 8+), at what collision threshold does the linked list convert to a Red-Black tree?',
      options: [
        'When collisions reach 8 elements (TREEIFY_THRESHOLD)',
        'When collisions reach 16 elements',
        'It never converts to a tree',
        'Only when the load factor drops below 0.5'
      ],
      correctIndex: 0,
      explanation: 'In Java 8, when a bucket has 8 or more entries and the table capacity is at least 64, HashMap converts the linked list to a balanced Red-Black tree to maintain O(log N) search latency.'
    }
  },

  // 6. Python - Memory Model, GIL & Advanced Language Paradigms
  'python': {
    keywords: ['python', 'gil', 'global interpreter lock', 'generator', 'yield', 'decorator', 'list comprehension', 'dunder', 'memory management', 'duck typing', 'asyncio'],
    title: 'Python: Memory Management, GIL & Functional Paradigms',
    beginner: {
      explanation: 'Python is a dynamically typed, high-level language designed for maximum readability. In Python, "everything is an object"—even simple numbers, functions, and classes themselves. You don\'t write type declarations like int or float because the interpreter deduces types at runtime.',
      analogy: 'Think of variables in Python not as boxes holding things, but as sticky name tags pasted onto objects. Assigning b = a simply attaches a second name tag to the very same object in memory.',
      example: 'Writing a = [1, 2, 3] creates a list object in memory. Setting b = a and mutating b.append(4) also modifies a because both tags point to the identical list object.'
    },
    intermediate: {
      explanation: 'Python utilizes automatic memory management based on Reference Counting combined with a Cyclic Garbage Collector (gc module) to detect circular reference loops that reference counting alone cannot reclaim.',
      breakdown: [
        'Reference Counting: Every PyObject holds an ob_refcnt counter. When a variable goes out of scope or is deleted, refcount decrements. When it hits 0, memory is immediately deallocated.',
        'Generators & Yield: Generators compute values lazily on-demand rather than materializing giant collections in RAM, preserving memory for massive data pipelines.',
        'Decorators: Higher-order functions that take a function as input, wrap additional behavior around it (such as logging or caching), and return the callable.'
      ],
      code: {
        language: 'python',
        code: `# Memory-efficient streaming generator vs memory-heavy list
def stream_large_log_file(file_path):
    """Yields one line at a time; uses O(1) RAM even for 50GB files."""
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            if 'ERROR' in line:
                yield line.strip()

# Decorator pattern with *args and **kwargs
def execution_timer(func):
    import time
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"[{func.__name__}] took {elapsed * 1000:.2f}ms")
        return result
    return wrapper`,
        explanation: 'Generators yield items lazily without exhausting RAM, while decorators wrap reusable cross-cutting concerns.'
      }
    },
    advanced: {
      explanation: 'CPython relies on the Global Interpreter Lock (GIL)—a mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecodes concurrently on multi-core CPUs.',
      internalMechanics: [
        'GIL Impact: Python multi-threading is effective for I/O-bound tasks (network requests, disk reads) where the thread releases the GIL while waiting; CPU-bound tasks require multiprocessing or C-extensions.',
        'Generational GC: Collects cyclic references across 3 generations (Gen 0, Gen 1, Gen 2). Newly allocated objects start in Gen 0; survivors move to older generations which are scanned less frequently.',
        'PyObject Structure: Every Python object in CPython has an ob_refcnt and a pointer to its type struct ob_type.'
      ],
      complexityAnalysis: 'Dict lookups: O(1) average hash table lookup. Python dicts are ordered by insertion since Python 3.6+ using compact arrays.',
      tradeoffs: 'High developer velocity and expressive syntax; trade-off is interpreted runtime overhead and CPU multi-core concurrency constraints requiring Celery or multiprocessing pools.'
    },
    examTips: [
      'Standard 8-mark university question: "Explain Python Memory Management with Reference Counting and Generational Garbage Collection."',
      'Explain the difference between deepcopy and shallow copy with mutable object examples.',
      'Contrast Lists (mutable dynamic arrays) and Tuples (immutable fixed-size contiguous memory blocks).'
    ],
    careerRelevance: 'Crucial for Data Engineering, Machine Learning Infrastructure, Backend API development (FastAPI/Django), and Systems automation interviews.',
    miniQuiz: {
      question: 'Why does Python need a cyclic garbage collector if it already uses reference counting?',
      options: [
        'Reference counting cannot detect isolated circular reference loops (e.g. object A points to B and B points to A)',
        'Reference counting is only supported for integers',
        'Reference counting cannot free memory on 64-bit systems',
        'Cyclic garbage collection is needed to support multithreading'
      ],
      correctIndex: 0,
      explanation: 'If object A holds a reference to object B, and B holds a reference to A, their reference counts never drop to 0 even when disconnected from root scope. Python generational GC runs periodically to identify and break these unreachable cycles.'
    }
  },

  // 7. Mathematics - Discrete Structures, Linear Algebra & Probability
  'mathematics': {
    keywords: ['mathematics', 'math', 'discrete math', 'probability', 'bayes', 'eigenvalue', 'matrix', 'graph theory', 'truth table', 'propositional logic', 'combinatorics'],
    title: 'Applied Computer Science Mathematics: Discrete Structures & Probability',
    beginner: {
      explanation: 'Computer Science is fundamentally applied discrete mathematics. Unlike the continuous real world (where time flows smoothly), computers work with distinct, separate steps (0s and 1s, true and false, graphs of interconnected nodes, and discrete probabilities).',
      analogy: 'Continuous math is like a ramp you slide down; discrete math is like a staircase where you take distinct whole steps from step 1 to step 2.',
      example: 'Propositional logic is the bedrock of computer programming: IF (attendance >= 75% AND internalMarks >= 50) THEN eligibility = TRUE. Truth tables allow formal verification that this boolean logic has no logical gaps.'
    },
    intermediate: {
      explanation: 'Core mathematical pillars in engineering include: (1) Graph Theory for network routing and social networks, (2) Bayes Theorem for conditional probability and diagnostic classification, and (3) Linear Algebra for vector spaces and machine learning representations.',
      breakdown: [
        'Graph Theory: G = (V, E). Trees are connected acyclic graphs with |V| - 1 edges. Adjacency matrices represent graphs in O(1) edge lookup time.',
        'Bayes Theorem: P(A|B) = [P(B|A) * P(A)] / P(B). Calculates posterior probability given observed evidence.',
        'Eigenvalues & Eigenvectors: For matrix A, A*v = λ*v. Vectors whose direction does not change under linear transformation, forming the basis of Google PageRank and PCA.'
      ],
      code: {
        language: 'python',
        code: `# Discrete Math: Computing Bayes Theorem for student risk prediction
def bayes_risk_probability(p_risk, p_low_attend_given_risk, p_low_attend):
    """
    Computes P(Student at Risk | Low Attendance Observed)
    P(A|B) = P(B|A) * P(A) / P(B)
    """
    posterior = (p_low_attend_given_risk * p_risk) / p_low_attend
    return round(posterior, 4)

# Example: Base risk = 15%, 80% of at-risk students have low attendance,
# overall 20% of campus has low attendance:
risk_probability = bayes_risk_probability(0.15, 0.80, 0.20)
print(f"Posterior Probability of Academic Risk: {risk_probability * 100}%") # 60.0%`,
        explanation: 'Bayesian inference updates belief based on observed feature evidence, used in predictive student analytics.'
      }
    },
    advanced: {
      explanation: 'In advanced computing, Discrete Mathematics and Linear Algebra underpin cryptographic protocols (RSA based on Euler\'s totient theorem and modular arithmetic), Singular Value Decomposition (SVD), and Markov Decision Processes.',
      internalMechanics: [
        'Spectral Graph Theory: Properties of graphs deduced via eigenvalues of the Graph Laplacian matrix L = D - A.',
        'Combinatorics & Generating Functions: Counting permutations and solving recurrence relations via polynomial coefficients.',
        'Markov Chains: Stochastic state transitions with stationary distributions π = π*P for equilibrium modeling.'
      ],
      complexityAnalysis: 'Matrix Multiplication: Standard O(N^3), Strassen\'s algorithm O(N^2.807), Coppersmith-Winograd asymptotic limit O(N^2.373).',
      tradeoffs: 'Adjacency Matrix requires O(V^2) dense space but provides O(1) edge checks; Adjacency List uses O(V + E) sparse space optimal for real-world sparse graphs.'
    },
    examTips: [
      'High-scoring 10-mark question: "State and prove Bayes Theorem with a tree diagram and solve a numerical medical/diagnostic classification problem."',
      'Ensure you know how to find the characteristic polynomial det(A - λI) = 0 to calculate Eigenvalues and corresponding Eigenvectors.',
      'Distinguish between Eulerian Circuit (visits every edge once) and Hamiltonian Cycle (visits every vertex once, NP-complete problem).'
    ],
    careerRelevance: 'Crucial for Data Science, Quantitative Finance, Machine Learning Research, Cryptography, and Algorithmic Game Theory rounds.',
    miniQuiz: {
      question: 'What is the necessary and sufficient condition for a connected undirected graph to contain an Eulerian Trail (path traversing every edge exactly once)?',
      options: [
        'Exactly zero or two vertices have an odd degree',
        'All vertices must have an odd degree',
        'The graph must be a complete bipartite graph',
        'The graph must contain no cycles'
      ],
      correctIndex: 0,
      explanation: 'Euler proved that a connected graph has an Eulerian trail if and only if either 0 vertices have an odd degree (Eulerian circuit) or exactly 2 vertices have an odd degree (Eulerian trail starting and ending at the odd vertices).'
    }
  }
};

export function queryTutorEngine(
  query: string,
  subject: string,
  mode: TutorMode,
  level: TutorLevel,
  previousMessages: TutorMessage[] = []
): TutorMessage {
  const q = query.toLowerCase().trim();

  // Find matching knowledge base entry
  let matchedEntry: SubjectTopicKnowledge | null = null;
  for (const key of Object.keys(KNOWLEDGE_BASE)) {
    const entry = KNOWLEDGE_BASE[key];
    if (entry.keywords.some(k => q.includes(k)) || q.includes(key) || subject.toLowerCase().includes(key)) {
      matchedEntry = entry;
      break;
    }
  }

  // Fallback entry if query is general
  if (!matchedEntry) {
    matchedEntry = KNOWLEDGE_BASE['indexing']; // default academic concept
  }

  // Build response based on Level & Mode
  let responseText = '';
  let codeSnippet = undefined;
  let keyTakeaways: string[] = [];
  let followUps: string[] = [];

  if (mode === 'learn') {
    if (level === 'beginner') {
      responseText = `### 💡 Understanding ${matchedEntry.title} (Foundations)\n\n${matchedEntry.beginner.explanation}\n\n**Everyday Analogy:**\n${matchedEntry.beginner.analogy}\n\n**Concrete Example:**\n${matchedEntry.beginner.example}`;
      keyTakeaways = [
        'Core concept builds on intuitive real-world search/memory patterns',
        'Always evaluate performance trade-offs before choosing this pattern'
      ];
    } else if (level === 'intermediate') {
      responseText = `### ⚙️ ${matchedEntry.title} — Technical Breakdown\n\n${matchedEntry.intermediate.explanation}\n\n**Core Mechanics:**\n${matchedEntry.intermediate.breakdown.map(b => `• ${b}`).join('\n')}`;
      codeSnippet = matchedEntry.intermediate.code;
      keyTakeaways = matchedEntry.intermediate.breakdown.slice(0, 3);
    } else {
      responseText = `### 🚀 ${matchedEntry.title} — Deep Architecture & Internals\n\n${matchedEntry.advanced.explanation}\n\n**Concurrency & Kernel Considerations:**\n${matchedEntry.advanced.internalMechanics.map(m => `• ${m}`).join('\n')}\n\n**Complexity Analysis:**\n${matchedEntry.advanced.complexityAnalysis}\n\n**Production Trade-offs:**\n${matchedEntry.advanced.tradeoffs}`;
      codeSnippet = matchedEntry.intermediate.code;
      keyTakeaways = [matchedEntry.advanced.complexityAnalysis || 'O(log N) optimal traversal', matchedEntry.advanced.tradeoffs];
    }
    followUps = [
      'Can you explain this with another real-world example?',
      'How does this topic usually appear in end-semester exams?',
      'Generate a 3-question practice quiz on this topic',
      'Add this concept to my weekly study plan'
    ];
  } else if (mode === 'exam_prep') {
    responseText = `### 📝 Exam Preparation Guide: ${matchedEntry.title}\n\nHere is how examiners evaluate this topic in mid-term and university end-semester examinations:\n\n**High-Yield Answer Blueprint (10 Marks):**\n${matchedEntry.intermediate.explanation}\n\n**Critical Points to Include for Full Marks:**\n${matchedEntry.examTips.map(t => `✅ ${t}`).join('\n')}\n\n**Common Pitfall to Avoid:**\nDo not confuse terminology. Always draw the step-by-step state transition or tree node diagram to secure structural evaluation marks.`;
    codeSnippet = matchedEntry.intermediate.code;
    keyTakeaways = matchedEntry.examTips;
    followUps = [
      'Show me a sample 5-mark answer format',
      'Test my understanding with an exam-style quiz',
      'Create a revision study task for tonight'
    ];
  } else if (mode === 'revision') {
    responseText = `### ⚡ Rapid Concept Revision: ${matchedEntry.title}\n\n**Core Definition:**\n${matchedEntry.intermediate.explanation}\n\n**Essential Memory Hooks:**\n${matchedEntry.intermediate.breakdown.map(b => `• ${b}`).join('\n')}\n\n**Formula / Complexity Summary:**\n${matchedEntry.advanced.complexityAnalysis || 'Standard logarithmic scaling'}`;
    keyTakeaways = matchedEntry.intermediate.breakdown;
    followUps = [
      'Quiz me to test retention',
      'Explain this in simpler terms',
      'Schedule a flashcard review for tomorrow'
    ];
  } else {
    // Career Learning Mode
    responseText = `### 💼 Career & Interview Relevance: ${matchedEntry.title}\n\n**Industry Application:**\n${matchedEntry.careerRelevance}\n\n**System Design Perspective:**\n${matchedEntry.advanced.explanation}\n\n**Key Interview Question:**\n"How would you optimize query latency or data consistency when scale grows by 100x?"\n\n**Answer Structure:**\n${matchedEntry.advanced.tradeoffs}`;
    codeSnippet = matchedEntry.intermediate.code;
    keyTakeaways = [
      `Targeted in FAANG & Tier-1 technical rounds: ${matchedEntry.careerRelevance}`,
      'Focus on operational trade-offs and edge-case handling'
    ];
    followUps = [
      'Give me a mock interview question on this topic',
      'How does this connect to my resume skill gaps?',
      'Generate a practice technical quiz'
    ];
  }

  // Handle special action prompts
  const isExplainSimply = q.includes('explain more simply') || q.includes('simpler');
  const isAnotherExample = q.includes('another example');
  const isGenerateQuiz = q.includes('generate quiz') || q.includes('quiz me') || q.includes('practice quiz');

  if (isExplainSimply) {
    responseText = `### 💡 Plain-English Breakdown\n\nLet's strip away all the textbook jargon.\n\n${matchedEntry.beginner.explanation}\n\n**In simple words:**\n${matchedEntry.beginner.analogy}\n\nDoes this click, or would you like another example from a different angle?`;
  } else if (isAnotherExample) {
    responseText = `### 📌 Additional Concrete Scenario\n\nConsider this real-world application:\n\n${matchedEntry.beginner.example}\n\nIn university systems, this is why searching for a student among 50,000 enrolled scholars returns in 4 milliseconds rather than locking the server.`;
  }

  return {
    id: `tutor-msg-${Date.now()}`,
    sender: 'assistant',
    timestamp: 'Just now',
    text: responseText,
    subject: matchedEntry.title,
    mode,
    level,
    codeSnippet,
    keyTakeaways,
    followUps,
    hasGeneratedQuiz: isGenerateQuiz,
    quizPreview: isGenerateQuiz ? matchedEntry.miniQuiz : undefined
  };
}
