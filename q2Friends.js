class Person {
    constructor(name) {
        this.name = name;
        this.friends = [];
    }

    addFriend(friend) {
        this.friends.push(friend);
    }
}

function findFriends(person) {
    return new Set(person.friends.map(friend => friend.name));
}

function findCommonFriends(person1, person2) {
    const friends1 = findFriends(person1);
    const friends2 = findFriends(person2);
    const commonFriends = new Set([...friends1].filter(friend => friends2.has(friend)));
    return commonFriends;
}

function findConnectionLevel(person1, person2) {
    const visited = new Set();
    const queue = [{ person: person1, level: 0 }];

    while (queue.length > 0) {
        const { person, level } = queue.shift();
        if (person.name === person2.name) {
            return level;
        }
        if (!visited.has(person)) {
            visited.add(person);
            for (const friend of person.friends) {
                queue.push({ person: friend, level: level + 1 });
            }
        }
    }
    return -1;
}

// Create people
const alice = new Person("Alice");
const bob = new Person("Bob");
const janice = new Person("Janice");
const charlie = new Person("Charlie");
const david = new Person("David");

// Establish friendships
alice.addFriend(bob);
bob.addFriend(janice);
alice.addFriend(charlie);
charlie.addFriend(david);

// Test functions
console.log("Friends of Alice:", Array.from(findFriends(alice)));
console.log("Friends of Bob:", Array.from(findFriends(bob)));
console.log("Common friends of Alice and Bob:", Array.from(findCommonFriends(alice, bob)));
console.log("Connection level between Alice and Janice:", findConnectionLevel(alice, janice));
console.log("Connection level between Alice and Bob:", findConnectionLevel(alice, bob));
console.log("Connection level between Alice and David:", findConnectionLevel(alice, david));

// Time and Space Complexity Analysis
// findFriends:
// Time Complexity: O(F), where F is the number of friends of the person.
// Space Complexity: O(F), for storing the set of friends.

// findCommonFriends:
// Time Complexity: O(F1 + F2), where F1 and F2 are the number of friends of person1 and person2, respectively.
// Space Complexity: O(F1 + F2), for storing the sets of friends.

// findConnectionLevel:
// Time Complexity: O(V + E), where V is the number of people (vertices) and E is the number of friendships (edges) in the graph.
// Space Complexity: O(V), for the visited set and the queue.
