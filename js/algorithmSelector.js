/**
 * SMARTSWAP — DYNAMIC ALGORITHM SELECTOR
 * =======================================
 * Implements Greedy Strategy to choose the best
 * search and sort algorithm based on:
 *   - Input size (n)
 *   - Data distribution (nearly-sorted detection)
 *
 * Design Analysis of Algorithms (DAA) Module
 */

// ─── SORTING ALGORITHMS ────────────────────────────────────────────────────

/** Bubble Sort — O(n²) time, O(1) space */
export function bubbleSort(arr) {
  const a = [...arr];
  const n = a.length;
  let comparisons = 0, swaps = 0;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      if (a[j] > a[j + 1]) { [a[j], a[j+1]] = [a[j+1], a[j]]; swaps++; swapped = true; }
    }
    if (!swapped) break; // Early termination for nearly-sorted
  }
  return { sorted: a, comparisons, swaps, timeComplexity: 'O(n²)', spaceComplexity: 'O(1)' };
}

/** Selection Sort — O(n²) time, O(1) space */
export function selectionSort(arr) {
  const a = [...arr];
  const n = a.length;
  let comparisons = 0, swaps = 0;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) { comparisons++; if (a[j] < a[minIdx]) minIdx = j; }
    if (minIdx !== i) { [a[i], a[minIdx]] = [a[minIdx], a[i]]; swaps++; }
  }
  return { sorted: a, comparisons, swaps, timeComplexity: 'O(n²)', spaceComplexity: 'O(1)' };
}

/** Insertion Sort — O(n²) worst, O(n) nearly-sorted, O(1) space */
export function insertionSort(arr) {
  const a = [...arr];
  const n = a.length;
  let comparisons = 0, shifts = 0;
  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) { comparisons++; a[j + 1] = a[j]; j--; shifts++; }
    comparisons++;
    a[j + 1] = key;
  }
  return { sorted: a, comparisons, shifts, timeComplexity: 'O(n²) / O(n) nearly-sorted', spaceComplexity: 'O(1)' };
}

/** Merge Sort — O(n log n) time, O(n) space */
export function mergeSort(arr) {
  let comparisons = 0;
  function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
      comparisons++;
      if (left[i] <= right[j]) result.push(left[i++]);
      else result.push(right[j++]);
    }
    return result.concat(left.slice(i)).concat(right.slice(j));
  }
  function ms(a) {
    if (a.length <= 1) return a;
    const mid = Math.floor(a.length / 2);
    return merge(ms(a.slice(0, mid)), ms(a.slice(mid)));
  }
  const sorted = ms([...arr]);
  return { sorted, comparisons, timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)' };
}

/** Quick Sort — O(n log n) avg, O(n²) worst, O(log n) space */
export function quickSort(arr) {
  let comparisons = 0, swaps = 0;
  function qs(a, lo, hi) {
    if (lo >= hi) return;
    // Median-of-three pivot for better average performance
    const mid = Math.floor((lo + hi) / 2);
    if (a[mid] < a[lo]) { [a[lo], a[mid]] = [a[mid], a[lo]]; swaps++; }
    if (a[hi]  < a[lo]) { [a[lo], a[hi]]  = [a[hi], a[lo]];  swaps++; }
    if (a[mid] < a[hi]) { [a[mid], a[hi]] = [a[hi], a[mid]]; swaps++; }
    const pivot = a[hi];
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      comparisons++;
      if (a[j] <= pivot) { i++; [a[i], a[j]] = [a[j], a[i]]; swaps++; }
    }
    [a[i+1], a[hi]] = [a[hi], a[i+1]]; swaps++;
    const p = i + 1;
    qs(a, lo, p - 1);
    qs(a, p + 1, hi);
  }
  const a = [...arr];
  qs(a, 0, a.length - 1);
  return { sorted: a, comparisons, swaps, timeComplexity: 'O(n log n) avg', spaceComplexity: 'O(log n)' };
}

/** Tim Sort (simplified: Insertion on runs + Merge) — O(n log n), O(n) space */
export function timSort(arr) {
  const RUN = 32;
  const a = [...arr];
  const n = a.length;
  let comparisons = 0;
  // Sort individual sub-arrays of size RUN with insertion sort
  for (let i = 0; i < n; i += RUN) {
    const end = Math.min(i + RUN - 1, n - 1);
    for (let j = i + 1; j <= end; j++) {
      const key = a[j]; let k = j - 1;
      while (k >= i && a[k] > key) { comparisons++; a[k+1] = a[k]; k--; }
      comparisons++;
      a[k+1] = key;
    }
  }
  // Merge sorted sub-arrays
  function merge(l, m, r) {
    const left = a.slice(l, m+1);
    const right = a.slice(m+1, r+1);
    let i=0, j=0, k=l;
    while (i < left.length && j < right.length) {
      comparisons++;
      if (left[i] <= right[j]) a[k++] = left[i++];
      else a[k++] = right[j++];
    }
    while (i < left.length) a[k++] = left[i++];
    while (j < right.length) a[k++] = right[j++];
  }
  for (let size = RUN; size < n; size *= 2) {
    for (let l = 0; l < n; l += 2 * size) {
      const m = Math.min(l + size - 1, n - 1);
      const r = Math.min(l + 2 * size - 1, n - 1);
      if (m < r) merge(l, m, r);
    }
  }
  return { sorted: a, comparisons, timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)' };
}

// ─── SEARCHING ALGORITHMS ──────────────────────────────────────────────────

/** Linear Search — O(n) time, O(1) space */
export function linearSearch(arr, target) {
  let comparisons = 0;
  for (let i = 0; i < arr.length; i++) {
    comparisons++;
    if (arr[i] === target || (typeof arr[i] === 'object' && arr[i].key === target)) {
      return { found: true, index: i, comparisons, timeComplexity: 'O(n)', spaceComplexity: 'O(1)' };
    }
  }
  return { found: false, index: -1, comparisons, timeComplexity: 'O(n)', spaceComplexity: 'O(1)' };
}

/** Binary Search (requires sorted array) — O(log n) time, O(1) space */
export function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1, comparisons = 0;
  while (lo <= hi) {
    comparisons++;
    const mid = Math.floor((lo + hi) / 2);
    const val = typeof arr[mid] === 'object' ? arr[mid].key : arr[mid];
    if (val === target) return { found: true, index: mid, comparisons, timeComplexity: 'O(log n)', spaceComplexity: 'O(1)' };
    if (val < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return { found: false, index: -1, comparisons, timeComplexity: 'O(log n)', spaceComplexity: 'O(1)' };
}

/** Hash-based Search — O(1) average time */
export function hashSearch(arr, target) {
  const map = new Map();
  for (let i = 0; i < arr.length; i++) {
    const key = typeof arr[i] === 'object' ? arr[i].key : arr[i];
    map.set(key, i);
  }
  const idx = map.has(target) ? map.get(target) : -1;
  return { found: idx !== -1, index: idx, comparisons: 1, timeComplexity: 'O(1) avg', spaceComplexity: 'O(n)' };
}

// ─── DATA DISTRIBUTION ANALYSIS ────────────────────────────────────────────

/**
 * Detect if array is nearly sorted.
 * Nearly sorted = ≥90% of elements are already in correct relative order.
 * @returns {number} sortedness fraction [0,1]
 */
export function detectSortedness(arr) {
  if (arr.length <= 1) return 1;
  let inOrder = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    const a = typeof arr[i] === 'object' ? arr[i].sortKey : arr[i];
    const b = typeof arr[i+1] === 'object' ? arr[i+1].sortKey : arr[i+1];
    if (a <= b) inOrder++;
  }
  return inOrder / (arr.length - 1);
}

/**
 * Detect if array values are highly uniform (low variance → bucket/counting sort beneficial)
 */
export function detectUniformity(arr) {
  const vals = arr.map(x => typeof x === 'object' ? x.sortKey : x).filter(Number.isFinite);
  if (vals.length < 2) return 0;
  const mean = vals.reduce((s,v) => s+v, 0) / vals.length;
  const variance = vals.reduce((s,v) => s + (v-mean)**2, 0) / vals.length;
  const std = Math.sqrt(variance);
  return std < (mean * 0.1) ? 1 : 0; // Highly uniform if std < 10% of mean
}

// ─── GREEDY DECISION TREE ──────────────────────────────────────────────────

/**
 * Core Greedy Strategy:
 * At each query, choose the algorithm with MINIMUM EXPECTED COST
 * based on input size n and data distribution.
 *
 * Cost function approximation:
 *   - O(1)      → cost = 1
 *   - O(log n)  → cost = Math.log2(n)
 *   - O(n)      → cost = n
 *   - O(n log n)→ cost = n * Math.log2(n)
 *   - O(n²)     → cost = n * n
 */
export const SORT_THRESHOLDS = { SMALL: 50, MEDIUM: 1000, LARGE: 100000 };
export const SEARCH_THRESHOLDS = { SMALL: 50, MEDIUM: 10000 };

export function greedySortSelector(arr, distribution) {
  const n = arr.length;
  const sortedness = distribution.sortedness;
  const isNearlySorted = sortedness >= 0.9;

  // Decision Tree for Sorting
  if (n < SORT_THRESHOLDS.SMALL) {
    // Small data: O(n²) acceptable; bubble sort benefits from nearly-sorted early exit
    if (isNearlySorted) {
      return {
        algorithm: 'Bubble Sort (Optimized)',
        fn: bubbleSort,
        reason: `n=${n} < 50 AND nearly sorted (${(sortedness*100).toFixed(0)}%) → early-exit bubble sort is optimal`,
        complexity: { time: 'O(n)', best: 'O(n)', worst: 'O(n²)', space: 'O(1)' },
        decisionPath: ['n < 50?', 'YES', 'Nearly sorted ≥90%?', 'YES', '→ Bubble Sort (optimized)']
      };
    }
    return {
      algorithm: 'Selection Sort',
      fn: selectionSort,
      reason: `n=${n} < 50 → selection sort minimizes swaps and is cache-friendly for small data`,
      complexity: { time: 'O(n²)', best: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
      decisionPath: ['n < 50?', 'YES', 'Nearly sorted ≥90%?', 'NO', '→ Selection Sort']
    };
  }
  if (n < SORT_THRESHOLDS.MEDIUM) {
    if (isNearlySorted) {
      return {
        algorithm: 'Insertion Sort',
        fn: insertionSort,
        reason: `n=${n} ∈ [50,1000) AND nearly sorted (${(sortedness*100).toFixed(0)}%) → insertion sort runs in O(n) for nearly-sorted`,
        complexity: { time: 'O(n)', best: 'O(n)', worst: 'O(n²)', space: 'O(1)' },
        decisionPath: ['n < 50?', 'NO', 'n < 1000?', 'YES', 'Nearly sorted?', 'YES', '→ Insertion Sort']
      };
    }
    return {
      algorithm: 'Merge Sort',
      fn: mergeSort,
      reason: `n=${n} ∈ [50,1000) → merge sort guarantees O(n log n) with stable output`,
      complexity: { time: 'O(n log n)', best: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
      decisionPath: ['n < 50?', 'NO', 'n < 1000?', 'YES', 'Nearly sorted?', 'NO', '→ Merge Sort']
    };
  }
  if (n < SORT_THRESHOLDS.LARGE) {
    if (isNearlySorted) {
      return {
        algorithm: 'Tim Sort',
        fn: timSort,
        reason: `n=${n} ∈ [1000,100000) AND nearly sorted → Tim Sort exploits existing runs (used by Python/Java)`,
        complexity: { time: 'O(n log n)', best: 'O(n)', worst: 'O(n log n)', space: 'O(n)' },
        decisionPath: ['n ≥ 1000?', 'YES', 'n < 100000?', 'YES', 'Nearly sorted?', 'YES', '→ Tim Sort']
      };
    }
    return {
      algorithm: 'Quick Sort',
      fn: quickSort,
      reason: `n=${n} ∈ [1000,100000) → quick sort with median-of-3 pivot dominates in practice`,
      complexity: { time: 'O(n log n) avg', best: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
      decisionPath: ['n ≥ 1000?', 'YES', 'n < 100000?', 'YES', 'Nearly sorted?', 'NO', '→ Quick Sort']
    };
  }
  // n ≥ 100,000
  return {
    algorithm: 'Merge Sort',
    fn: mergeSort,
    reason: `n=${n} ≥ 100,000 → merge sort guarantees O(n log n) worst-case; stability matters at scale`,
    complexity: { time: 'O(n log n)', best: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    decisionPath: ['n ≥ 100,000?', 'YES', '→ Merge Sort (stable, guaranteed)']
  };
}

export function greedySearchSelector(arr, target, isSorted, distribution) {
  const n = arr.length;
  const isNearlySorted = distribution.sortedness >= 0.9;

  if (n < SEARCH_THRESHOLDS.SMALL) {
    return {
      algorithm: 'Linear Search',
      fn: (a) => linearSearch(a, target),
      reason: `n=${n} < 50 → linear search is optimal; overhead of sorting or hashing not justified`,
      complexity: { time: 'O(n)', best: 'O(1)', worst: 'O(n)', space: 'O(1)' },
      decisionPath: ['n < 50?', 'YES', '→ Linear Search']
    };
  }
  if (n >= SEARCH_THRESHOLDS.SMALL && n < SEARCH_THRESHOLDS.MEDIUM) {
    // For medium data, binary search only if sorted
    if (isSorted || isNearlySorted) {
      return {
        algorithm: 'Binary Search',
        fn: (a) => binarySearch(a, target),
        reason: `n=${n} ∈ [50,10000), data is ${isSorted ? 'sorted' : 'nearly sorted'} → binary search O(log n) optimal`,
        complexity: { time: 'O(log n)', best: 'O(1)', worst: 'O(log n)', space: 'O(1)' },
        decisionPath: ['n ≥ 50?', 'YES', 'Sorted?', 'YES', '→ Binary Search']
      };
    }
    return {
      algorithm: 'Linear Search',
      fn: (a) => linearSearch(a, target),
      reason: `n=${n}, unsorted → linear search avoids O(n log n) sort overhead for single queries`,
      complexity: { time: 'O(n)', best: 'O(1)', worst: 'O(n)', space: 'O(1)' },
      decisionPath: ['n ≥ 50?', 'YES', 'Sorted?', 'NO', '→ Linear Search']
    };
  }
  // n ≥ 10,000
  return {
    algorithm: 'Hash Search',
    fn: (a) => hashSearch(a, target),
    reason: `n=${n} ≥ 10,000 → hash map amortizes to O(1) per query; optimal for large datasets`,
    complexity: { time: 'O(1) avg', best: 'O(1)', worst: 'O(n)', space: 'O(n)' },
    decisionPath: ['n ≥ 10,000?', 'YES', '→ Hash Search (O(1) avg)']
  };
}

// ─── MAIN ALGORITHM SELECTOR (Entry Point) ────────────────────────────────

/**
 * Dynamic Algorithm Selector — Greedy Entry Point
 * @param {Array} data - Dataset
 * @param {string} operation - 'sort' | 'search'
 * @param {*} target - Search target (for search operations)
 * @param {boolean} isSorted - Whether data is already sorted
 * @returns {Object} { result, algorithmUsed, reason, complexity, executionTime, metrics }
 */
export function dynamicAlgorithmSelector(data, operation, target = null, isSorted = false) {
  const n = data.length;
  const startAnalysis = performance.now();

  // Step 1: Analyze data distribution (Greedy information gathering)
  const sortedness = detectSortedness(data);
  const uniformity = detectUniformity(data);
  const distribution = { sortedness, uniformity, n, isNearlySorted: sortedness >= 0.9 };

  const analysisTime = performance.now() - startAnalysis;

  let selection, execResult, execTime;

  if (operation === 'sort') {
    // Step 2: Greedy algorithm selection for sorting
    selection = greedySortSelector(data, distribution);

    // Step 3: Execute selected algorithm
    const t0 = performance.now();
    execResult = selection.fn(data);
    execTime = performance.now() - t0;

    return {
      result: execResult.sorted,
      algorithmUsed: selection.algorithm,
      operation: 'sort',
      reason: selection.reason,
      complexity: selection.complexity,
      decisionPath: selection.decisionPath,
      executionTime: execTime,
      analysisTime,
      metrics: {
        n,
        comparisons: execResult.comparisons || 0,
        swaps: execResult.swaps || execResult.shifts || 0,
        sortedness: `${(sortedness * 100).toFixed(1)}%`,
        uniformity: uniformity === 1 ? 'High' : 'Normal',
      }
    };
  }

  if (operation === 'search') {
    // Step 2: Greedy algorithm selection for searching
    selection = greedySearchSelector(data, target, isSorted, distribution);

    // Step 3: Execute
    const t0 = performance.now();
    execResult = selection.fn(data);
    execTime = performance.now() - t0;

    return {
      result: execResult,
      algorithmUsed: selection.algorithm,
      operation: 'search',
      reason: selection.reason,
      complexity: selection.complexity,
      decisionPath: selection.decisionPath,
      executionTime: execTime,
      analysisTime,
      metrics: {
        n,
        target,
        found: execResult.found,
        index: execResult.index,
        comparisons: execResult.comparisons,
        sortedness: `${(sortedness * 100).toFixed(1)}%`,
      }
    };
  }

  throw new Error(`Unknown operation: ${operation}`);
}

// ─── BENCHMARK RUNNER ─────────────────────────────────────────────────────

/**
 * Benchmark all sorting algorithms on a dataset.
 * Returns timing results for each algorithm for comparison.
 */
export function benchmarkAllSorts(arr) {
  const algorithms = [
    { name: 'Bubble Sort',    fn: bubbleSort,    applicable: arr.length <= 5000 },
    { name: 'Selection Sort', fn: selectionSort, applicable: arr.length <= 5000 },
    { name: 'Insertion Sort', fn: insertionSort, applicable: arr.length <= 5000 },
    { name: 'Merge Sort',     fn: mergeSort,     applicable: true },
    { name: 'Quick Sort',     fn: quickSort,     applicable: true },
    { name: 'Tim Sort',       fn: timSort,       applicable: true },
  ];

  return algorithms.map(algo => {
    if (!algo.applicable) {
      return { name: algo.name, time: null, skipped: true, reason: 'Skipped (n too large for O(n²))' };
    }
    const t0 = performance.now();
    const r = algo.fn(arr);
    const t = performance.now() - t0;
    return {
      name: algo.name,
      time: t,
      skipped: false,
      comparisons: r.comparisons || 0,
      timeComplexity: r.timeComplexity,
      spaceComplexity: r.spaceComplexity,
    };
  });
}

/**
 * Generate test data for analytics
 */
export function generateTestData(n, type = 'random') {
  switch(type) {
    case 'random':
      return Array.from({ length: n }, () => Math.floor(Math.random() * n * 10));
    case 'sorted':
      return Array.from({ length: n }, (_, i) => i);
    case 'reverse':
      return Array.from({ length: n }, (_, i) => n - i);
    case 'nearly-sorted': {
      const a = Array.from({ length: n }, (_, i) => i);
      // Swap ~5% pairs
      const swaps = Math.floor(n * 0.05);
      for (let i = 0; i < swaps; i++) {
        const x = Math.floor(Math.random() * n);
        const y = Math.floor(Math.random() * n);
        [a[x], a[y]] = [a[y], a[x]];
      }
      return a;
    }
    default:
      return Array.from({ length: n }, () => Math.floor(Math.random() * n));
  }
}
