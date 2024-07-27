const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let tasks = [];
let durations = {};
let dependencies = {};

function promptTask() {
    rl.question('Enter task name (or type "done" to finish): ', taskName => {
        if (taskName.toLowerCase() === 'done') {
            rl.close();
            calculateAndDisplayResults();
            return;
        }
        rl.question(`Enter duration for task ${taskName}: `, duration => {
            rl.question(`Enter dependencies for task ${taskName} (comma-separated): `, deps => {
                const taskDuration = parseInt(duration.trim());
                const taskDeps = deps.trim().split(',').map(dep => dep.trim()).filter(dep => dep);

                if (!taskName || isNaN(taskDuration)) {
                    console.log('Please provide a valid task name and duration');
                    return promptTask();
                }

                tasks.push(taskName);
                durations[taskName] = taskDuration;
                dependencies[taskName] = taskDeps;
                promptTask();
            });
        });
    });
}

function computeTimes(tasks, durations, dependencies) {
    const EST = {};
    const EFT = {};
    const LST = {};
    const LFT = {};

    tasks.forEach(task => {
        EST[task] = 0;
        EFT[task] = 0;
    });

    const topoOrder = topologicalSort(tasks, dependencies);
    topoOrder.forEach(task => {
        dependencies[task].forEach(dep => {
            EST[task] = Math.max(EST[task], EFT[dep]);
        });
        EFT[task] = EST[task] + durations[task];
    });

    const projectCompletionTime = Math.max(...Object.values(EFT));
    tasks.forEach(task => {
        LFT[task] = projectCompletionTime;
        LST[task] = LFT[task] - durations[task];
    });

    for (let i = topoOrder.length - 1; i >= 0; i--) {
        const task = topoOrder[i];
        dependencies[task].forEach(dep => {
            LFT[dep] = Math.min(LFT[dep], LST[task]);
            LST[dep] = LFT[dep] - durations[dep];
        });
    }

    return { EST, EFT, LST, LFT, earliestCompletion: projectCompletionTime, latestCompletion: projectCompletionTime };
}

function topologicalSort(tasks, dependencies) {
    const indegree = {};
    const graph = {};

    tasks.forEach(task => {
        indegree[task] = 0;
        graph[task] = [];
    });

    Object.entries(dependencies).forEach(([task, deps]) => {
        deps.forEach(dep => {
            if (!graph[dep]) graph[dep] = [];
            graph[dep].push(task);
            indegree[task]++;
        });
    });

    const queue = [];
    tasks.forEach(task => {
        if (indegree[task] === 0) queue.push(task);
    });

    const topoOrder = [];
    while (queue.length > 0) {
        const node = queue.shift();
        topoOrder.push(node);
        if (graph[node]) {
            graph[node].forEach(neighbor => {
                indegree[neighbor]--;
                if (indegree[neighbor] === 0) queue.push(neighbor);
            });
        }
    }

    return topoOrder;
}

function calculateAndDisplayResults() {
    const { EST, EFT, LST, LFT, earliestCompletion, latestCompletion } = computeTimes(tasks, durations, dependencies);

    console.log('\nResults:');
    console.log('Task | EST | EFT | LST | LFT');
    tasks.forEach(task => {
        console.log(`${task} | ${EST[task]} | ${EFT[task]} | ${LST[task]} | ${LFT[task]}`);
    });
    console.log(`\nEarliest time all tasks will be completed: ${earliestCompletion}`);
    console.log(`Latest time all tasks will be completed: ${latestCompletion}`);
}

promptTask();

/*
Time Complexity Analysis:

1. `promptTask` function:
   - Time Complexity: O(N), where N is the number of tasks. Each prompt takes constant time.

2. `computeTimes` function:
   - Time Complexity: O(V + E), where V is the number of tasks (vertices) and E is the number of dependencies (edges).
     - Initializing EST and EFT: O(V)
     - Topological sorting: O(V + E)
     - Computing EST and EFT: O(V + E)
     - Initializing LST and LFT: O(V)
     - Computing LST and LFT: O(V + E)

3. `topologicalSort` function:
   - Time Complexity: O(V + E)
     - Constructing the graph: O(V + E)
     - Topological sorting using Kahn's algorithm: O(V + E)

4. `calculateAndDisplayResults` function:
   - Time Complexity: O(V)
     - Displaying results: O(V)
     
Overall Time Complexity: O(V + E)
*/
