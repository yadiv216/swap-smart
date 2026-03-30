/**
 * SMARTSWAP — BACKEND ALGORITHM SELECTOR SERVICE
 * Node.js CommonJS mirror of the frontend ES module.
 * Runs on the server to handle /api/algorithm requests.
 */

// Sorting Algorithms
function bubbleSort(arr) {
  const a=[...arr]; let comparisons=0,swaps=0;
  for(let i=0;i<a.length-1;i++){
    let swapped=false;
    for(let j=0;j<a.length-i-1;j++){comparisons++;if(a[j]>a[j+1]){[a[j],a[j+1]]=[a[j+1],a[j]];swaps++;swapped=true;}}
    if(!swapped)break;
  }
  return {sorted:a,comparisons,swaps,timeComplexity:'O(n2)',spaceComplexity:'O(1)'};
}

function selectionSort(arr) {
  const a=[...arr]; let comparisons=0,swaps=0;
  for(let i=0;i<a.length-1;i++){
    let minIdx=i;
    for(let j=i+1;j<a.length;j++){comparisons++;if(a[j]<a[minIdx])minIdx=j;}
    if(minIdx!==i){[a[i],a[minIdx]]=[a[minIdx],a[i]];swaps++;}
  }
  return {sorted:a,comparisons,swaps,timeComplexity:'O(n2)',spaceComplexity:'O(1)'};
}

function insertionSort(arr) {
  const a=[...arr]; let comparisons=0,shifts=0;
  for(let i=1;i<a.length;i++){
    const key=a[i]; let j=i-1;
    while(j>=0&&a[j]>key){comparisons++;a[j+1]=a[j];j--;shifts++;}
    comparisons++;a[j+1]=key;
  }
  return {sorted:a,comparisons,shifts,timeComplexity:'O(n2)/O(n) nearly-sorted',spaceComplexity:'O(1)'};
}

function mergeSort(arr) {
  let comparisons=0;
  function merge(l,r){const res=[];let i=0,j=0;while(i<l.length&&j<r.length){comparisons++;if(l[i]<=r[j])res.push(l[i++]);else res.push(r[j++]);}return res.concat(l.slice(i)).concat(r.slice(j));}
  function ms(a){if(a.length<=1)return a;const mid=Math.floor(a.length/2);return merge(ms(a.slice(0,mid)),ms(a.slice(mid)));}
  return {sorted:ms([...arr]),comparisons,timeComplexity:'O(n log n)',spaceComplexity:'O(n)'};
}

function quickSort(arr) {
  let comparisons=0,swaps=0;
  function qs(a,lo,hi){
    if(lo>=hi)return;
    const mid=Math.floor((lo+hi)/2);
    if(a[mid]<a[lo]){[a[lo],a[mid]]=[a[mid],a[lo]];swaps++;}
    if(a[hi]<a[lo]){[a[lo],a[hi]]=[a[hi],a[lo]];swaps++;}
    if(a[mid]<a[hi]){[a[mid],a[hi]]=[a[hi],a[mid]];swaps++;}
    const pivot=a[hi]; let i=lo-1;
    for(let j=lo;j<hi;j++){comparisons++;if(a[j]<=pivot){i++;[a[i],a[j]]=[a[j],a[i]];swaps++;}}
    [a[i+1],a[hi]]=[a[hi],a[i+1]];swaps++;
    const p=i+1; qs(a,lo,p-1); qs(a,p+1,hi);
  }
  const a=[...arr]; qs(a,0,a.length-1);
  return {sorted:a,comparisons,swaps,timeComplexity:'O(n log n) avg',spaceComplexity:'O(log n)'};
}

// Search Algorithms
function linearSearch(arr,target){let comparisons=0;for(let i=0;i<arr.length;i++){comparisons++;if(arr[i]===target)return{found:true,index:i,comparisons,timeComplexity:'O(n)'};}return{found:false,index:-1,comparisons,timeComplexity:'O(n)'};}
function binarySearch(arr,target){let lo=0,hi=arr.length-1,comparisons=0;while(lo<=hi){comparisons++;const mid=Math.floor((lo+hi)/2);if(arr[mid]===target)return{found:true,index:mid,comparisons,timeComplexity:'O(log n)'};if(arr[mid]<target)lo=mid+1;else hi=mid-1;}return{found:false,index:-1,comparisons,timeComplexity:'O(log n)'};}
function hashSearch(arr,target){const map=new Map(arr.map((v,i)=>[v,i]));const idx=map.has(target)?map.get(target):-1;return{found:idx!==-1,index:idx,comparisons:1,timeComplexity:'O(1) avg'};}

function detectSortedness(arr){if(arr.length<=1)return 1;let ok=0;for(let i=0;i<arr.length-1;i++)if(arr[i]<=arr[i+1])ok++;return ok/(arr.length-1);}

function dynamicAlgorithmSelector(data,operation,target,isSorted){
  const n=data.length;
  const sortedness=detectSortedness(data);
  const isNearlySorted=sortedness>=0.9;
  let selection,result;
  const t0=Date.now();
  if(operation==='sort'){
    if(n<50){
      if(isNearlySorted){selection={name:'Bubble Sort',fn:bubbleSort,tc:'O(n->n2)',reason:'n<50 nearly sorted'};
      }else{selection={name:'Selection Sort',fn:selectionSort,tc:'O(n2)',reason:'n<50 minimize swaps'};}
    }else if(n<1000){
      if(isNearlySorted){selection={name:'Insertion Sort',fn:insertionSort,tc:'O(n)',reason:'n<1000 nearly sorted'};
      }else{selection={name:'Merge Sort',fn:mergeSort,tc:'O(n log n)',reason:'n<1000 stable'};}
    }else if(n<100000){
      if(isNearlySorted){selection={name:'Tim Sort',fn:require('./timSort'),tc:'O(n log n)',reason:'n>=1000 nearly sorted'};
      }else{selection={name:'Quick Sort',fn:quickSort,tc:'O(n log n)',reason:'n>=1000 random'};}
    }else{
      selection={name:'Merge Sort',fn:mergeSort,tc:'O(n log n)',reason:'n>=100000 stable guaranteed'};
    }
    result=selection.fn(data);
  }else{
    if(n<50){selection={name:'Linear Search',fn:a=>linearSearch(a,target),tc:'O(n)',reason:'n<50'};
    }else if(n<10000){
      if(isSorted||isNearlySorted){selection={name:'Binary Search',fn:a=>binarySearch(a,target),tc:'O(log n)',reason:'sorted medium data'};
      }else{selection={name:'Linear Search',fn:a=>linearSearch(a,target),tc:'O(n)',reason:'unsorted medium data'};}
    }else{
      selection={name:'Hash Search',fn:a=>hashSearch(a,target),tc:'O(1)',reason:'n>=10000'}; }
    result=selection.fn(data);
  }
  const execTime=Date.now()-t0;
  return{algorithmUsed:selection.name,timeComplexity:selection.tc,reason:selection.reason,executionTime:execTime,n,sortedness:(sortedness*100).toFixed(1)+'%',result};
}

module.exports = { dynamicAlgorithmSelector, detectSortedness };
